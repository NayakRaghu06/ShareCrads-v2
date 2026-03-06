import { useState, useEffect, useRef } from 'react';
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
import { apiFetch } from '../../utils/api';
import { saveSession } from '../../utils/storage';

const OTP_LENGTH = 6;

export default function LoginScreen({ navigation }) {
  const [phone, setPhone]           = useState('');
  const [otpSent, setOtpSent]       = useState(false);
  const [otp, setOtp]               = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer]           = useState(0);
  const [canResend, setCanResend]   = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying]   = useState(false);

  const inputs = useRef([]);

  // ── Countdown timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── Phone input ──────────────────────────────────────────────────────────────
  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    // Reset OTP flow if user edits the number
    if (otpSent) {
      setOtpSent(false);
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimer(0);
      setCanResend(false);
    }
  };

  const validPhone = (v) => /^[1-9]\d{9}$/.test(v);

  // ── Start OTP flow (shared by Send and Resend) ───────────────────────────────
  const startOtpFlow = async (endpoint) => {
    setSendingOtp(true);
    try {
      const { res, data } = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: phone }),
      });

      if (res.ok && data?.status === 1) {
        setOtpSent(true);
        setOtp(Array(OTP_LENGTH).fill(''));
        setTimer(30);
        setCanResend(false);
        setTimeout(() => inputs.current[0]?.focus(), 300);
      } else if (res.status === 404 || data?.status === 0) {
        // User not registered — offer to sign up
        Alert.alert(
          'Not Registered',
          data?.message || 'This number is not registered. Would you like to create an account?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Up', onPress: () => navigation.navigate('Signup') },
          ]
        );
      } else {
        Alert.alert('Error', data?.message || 'Failed to send OTP. Please try again.');
      }
    } catch {
      Alert.alert('Network Error', 'Unable to connect. Please check your internet and try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  // ── Send OTP ─────────────────────────────────────────────────────────────────
  const handleSendOtp = () => {
    if (!validPhone(phone)) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    startOtpFlow('/auth/mobile/login');
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResendOtp = () => {
    if (!canResend || sendingOtp) return;
    startOtpFlow('/auth/resend/login-otp');
  };

  // ── OTP box input ────────────────────────────────────────────────────────────
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
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const resetOtp = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setTimeout(() => inputs.current[0]?.focus(), 200);
  };

  // ── Verify OTP & Login ───────────────────────────────────────────────────────
  const handleLogin = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== OTP_LENGTH) {
      Alert.alert('Incomplete OTP', 'Please enter all 6 digits of the OTP.');
      return;
    }

    setVerifying(true);
    try {
      const { res, data } = await apiFetch('/auth/login/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: phone, otp: enteredOtp }),
      });


      if (res.ok && data?.status === 1) {
        await AsyncStorage.setItem('userPhone', phone);

        // Fetch and store userId
        try {
          const { res: profileRes, data: profileData } = await apiFetch('/user/profile');
          if (profileRes.ok && profileData?.data?.userId != null) {
            await AsyncStorage.setItem('loggedInUserId', String(profileData.data.userId));
          }
        } catch (e) {
          console.warn('Failed to save session', e);
        }

        await saveSession(phone);
        navigation.replace('Landing');

      } else if (res.status === 404 || data?.status === 2) {
        // Account does not exist — redirect to signup
        Alert.alert(
          'Account Not Found',
          'No account found for this number. Please sign up to create one.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Up', onPress: () => navigation.navigate('Signup') },
          ]
        );
      } else {
        Alert.alert('Wrong OTP', data?.message || 'The OTP you entered is incorrect. Please try again.');
        resetOtp();
      }
    } catch {
      Alert.alert('Network Error', 'Login failed. Please check your internet connection.');
    } finally {
      setVerifying(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────────
  const isSendDisabled = !validPhone(phone) || sendingOtp || (otpSent && timer > 0);

  return (
    <SafeAreaView style={loginStyles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={loginStyles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1 }}>

            {/* ── Header ── */}
            <Header style={loginStyles.header}>
              <View style={loginStyles.iconWrap}>
                <Text style={loginStyles.icon}>💼</Text>
              </View>
              <Text style={loginStyles.appTitle}>Digital Business Card</Text>
              <Text style={loginStyles.subtitle}>Grow your business digitally</Text>
            </Header>

            {/* ── Card ── */}
            <View style={loginStyles.card}>

              {/* Phone Input */}
              <InputField
                label="Mobile Number"
                icon="call-outline"
                placeholder="Enter mobile number"
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="number-pad"
                showCountry
                countryCode="+91"
                editable={!verifying}
              />

              {/* Send OTP Button */}
              <PrimaryButton
                title={sendingOtp ? 'Sending OTP...' : otpSent ? 'OTP Sent' : 'Send OTP'}
                onPress={handleSendOtp}
                disabled={isSendDisabled}
              />

              {/* OTP Section */}
              {otpSent && (
                <>
                  <Text style={loginStyles.resendText} numberOfLines={1}>
                    OTP sent to +91 {phone}
                  </Text>

                  {/* OTP Boxes */}
                  <View style={loginStyles.otpRow}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={r => (inputs.current[index] = r)}
                        style={loginStyles.otpBox}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={value => handleOtpChange(value, index)}
                        onKeyPress={e => handleKeyPress(e, index)}
                        editable={!verifying}
                        selectTextOnFocus
                      />
                    ))}
                  </View>

                  {/* Resend Timer */}
                  <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={!canResend || sendingOtp}
                    style={loginStyles.resendWrap}
                  >
                    <Text style={[
                      loginStyles.resendText,
                      (!canResend || sendingOtp) && { opacity: 0.5 },
                    ]}>
                      {sendingOtp
                        ? 'Sending...'
                        : canResend
                          ? 'Resend OTP'
                          : `Resend OTP in ${timer}s`}
                    </Text>
                  </TouchableOpacity>

                  {/* Login Button */}
                  <PrimaryButton
                    title={verifying ? 'Verifying...' : 'Login'}
                    onPress={handleLogin}
                    disabled={otp.join('').length !== OTP_LENGTH || verifying}
                  />
                </>
              )}

              {/* Divider */}
              <View style={loginStyles.dividerRow}>
                <View style={loginStyles.line} />
                <Text style={loginStyles.newHereText}>New here?</Text>
                <View style={loginStyles.line} />
              </View>

              {/* Sign Up Link */}
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
