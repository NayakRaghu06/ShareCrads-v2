
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import InputField from '../../components/form/InputField';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { loginStyles } from '../../styles/screens/loginStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔥 IMPORT YOUR API
import { apiFetch } from '../../utils/api';
import { saveSession } from '../../utils/storage';

const OTP_LENGTH = 6;

export default function LoginScreen({ navigation }) {

  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [cooldown, setCooldown] = useState(false); // disables both buttons
  const [sendingOtp, setSendingOtp] = useState(false); // prevents double API

  const inputs = useRef([]);

  // ================= TIMER =================
  useEffect(() => {
    let interval;
    if (otpSent && cooldown && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    if (timer === 0 && cooldown) {
      setCanResend(true);
      setCooldown(false);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer, cooldown]);

  // ================= PHONE INPUT =================
  const handlePhoneChange = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);
    setPhone(cleaned);
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    if (cooldown || sendingOtp) return;
    if (!/^[1-9]\d{9}$/.test(phone)) {
      Alert.alert('Invalid Number', 'Enter valid 10 digit mobile number');
      return;
    }
    setSendingOtp(true);
    try {
      const { res, data } = await apiFetch('/auth/mobile/login', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: phone }),
      });
      if (res.ok && data.status === 1) {
        Alert.alert('OTP Sent ✅', data.message || 'Check your mobile');
        setOtpSent(true);
        setTimer(30);
        setCanResend(false);
        setCooldown(true);
        setOtp(Array(OTP_LENGTH).fill(''));
        setTimeout(() => {
          inputs.current[0]?.focus();
        }, 300);
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch {
      Alert.alert('Error', 'Network error');
    } finally {
      setSendingOtp(false);
    }
  };

  // ================= RESEND OTP =================
  const handleResendOtp = async () => {
    if (!canResend || cooldown || sendingOtp) return;
    setSendingOtp(true);
    try {
      const { res, data } = await apiFetch('/auth/resend/login-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: phone }),
      });
      if (res.ok && data.status === 1) {
        Alert.alert('OTP Resent ✅');
        setTimer(30);
        setCanResend(false);
        setCooldown(true);
        setOtp(Array(OTP_LENGTH).fill(''));
        setTimeout(() => {
          inputs.current[0]?.focus();
        }, 300);
      } else {
        Alert.alert('Error', data.message || 'Failed');
      }
    } catch {
      Alert.alert('Error', 'Network error');
    } finally {
      setSendingOtp(false);
    }
  };

  // ================= OTP INPUT =================
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const resetOtp = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setTimeout(() => {
      inputs.current[0]?.focus();
    }, 200);
  };

  // ================= VERIFY OTP =================
  const handleLogin = async () => {

    const enteredOtp = otp.join('');

    if (enteredOtp.length !== OTP_LENGTH) {
      Alert.alert('Error', 'Enter complete 6 digit OTP');
      return;
    }

    try {

      const { res, data } = await apiFetch('/auth/login/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          mobileNumber: phone,
          otp: enteredOtp,
        }),
      });

      if (res.ok && data.status === 1) {

        // Save session after successful login
        try {
          await AsyncStorage.setItem('userPhone', phone);
          // GET /user/profile — fetch userId after login (session cookie is now set)
          const { res: pRes, data: pData } = await apiFetch('/user/profile');
          if (pRes.ok && pData?.data?.userId) {
            await AsyncStorage.setItem('loggedInUserId', String(pData.data.userId));
          }
        } catch (e) {
          console.warn('Failed to save session', e);
        }
        // Save session after successful OTP verification
        await saveSession(phone);

        Alert.alert('Success ', 'Login Successful');
        navigation.replace('Landing');

      } else {

        Alert.alert('Wrong OTP ❌', data.message || 'Invalid OTP');
        resetOtp();

      }

    } catch {
      Alert.alert('Error', 'Login failed');
    }
  };

  // ================= UI =================
  return (
    <SafeAreaView style={loginStyles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={loginStyles.container}>
          <View style={{ flex: 1 }}>

            <Header style={loginStyles.header}>
              <View style={loginStyles.iconWrap}>
                <Text style={loginStyles.icon}>💼</Text>
              </View>
              <Text style={loginStyles.appTitle}>Digital Business Card</Text>
              <Text style={loginStyles.subtitle}>
                Grow your business digitally
              </Text>
            </Header>

            <View style={loginStyles.card}>
              <InputField
                placeholder="Enter mobile number"
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="number-pad"
                showCountry
                countryCode="+91"
                maxLength={10}
              />

              <PrimaryButton
                title="Send OTP"
                onPress={handleSendOtp}
                disabled={cooldown || sendingOtp}
              />

              {otpSent && (
                <>
                  <View style={loginStyles.otpRow}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (inputs.current[index] = ref)}
                        style={loginStyles.otpBox}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(value) =>
                          handleOtpChange(value, index)
                        }
                        onKeyPress={(e) =>
                          handleKeyPress(e, index)
                        }
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={!canResend || cooldown || sendingOtp}
                    style={loginStyles.resendWrap}
                  >
                    <Text style={loginStyles.resendText}>
                      {canResend && !cooldown
                        ? 'Resend OTP'
                        : `Resend OTP in ${timer}s`}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <PrimaryButton
                title="Login"
                onPress={handleLogin}
                style={loginStyles.loginBtn}
              />

              <View style={loginStyles.dividerRow}>
                <View style={loginStyles.line} />
                <Text style={loginStyles.newHereText}>New here?</Text>
                <View style={loginStyles.line} />
              </View>

              <TouchableOpacity
                style={loginStyles.signupRow}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={loginStyles.createText}>Create your account </Text>
                <Text style={loginStyles.signupText}>Sign Up →</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
