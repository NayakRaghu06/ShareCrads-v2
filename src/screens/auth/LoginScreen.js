//
//import React, { useState, useEffect, useRef } from 'react';
//import {
//  View,
//  Text,
//  ScrollView,
//  KeyboardAvoidingView,
//  Platform,
//  TouchableOpacity,
//  TextInput,
//  Alert,
//} from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
//import Header from '../../components/common/Header';
//import InputField from '../../components/form/InputField';
//import PrimaryButton from '../../components/buttons/PrimaryButton';
//import { loginStyles } from '../../styles/screens/loginStyles';
//import { getUser, saveUser } from '../../utils/storage';
//
//const OTP_LENGTH = 6;
//
//// Generate 6 digit OTP
//const generateOTP = () => {
//  return Math.floor(100000 + Math.random() * 900000).toString();
//};
//
//export default function LoginScreen({ navigation }) {
//  const [phone, setPhone] = useState('');
//  const [otpSent, setOtpSent] = useState(false);
//  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
//  const [generatedOtp, setGeneratedOtp] = useState('');
//  const [timer, setTimer] = useState(30);
//  const [canResend, setCanResend] = useState(false);
//
//  const inputs = useRef([]);
//
//  // Timer
//  useEffect(() => {
//    let interval;
//    if (otpSent && timer > 0) {
//      interval = setInterval(() => setTimer((t) => t - 1), 1000);
//    }
//    if (timer === 0) setCanResend(true);
//    return () => clearInterval(interval);
//  }, [otpSent, timer]);
//
//  // Phone validation (Indian 10 digit)
//  const handlePhoneChange = (text) => {
//    let cleaned = text.replace(/\D/g, '');
//    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);
//    setPhone(cleaned);
//  };
//
//  // 🔥 SEND OTP (Check if user exists)
//  const handleSendOtp = async () => {
//    if (!/^[1-9]\d{9}$/.test(phone)) {
//      Alert.alert('Invalid Number', 'Enter valid 10 digit mobile number');
//      return;
//    }
//
//    const user = await getUser();
//
//    // If no user found → ask to signup
//    if (!user || user.phone !== phone) {
//      Alert.alert(
//        'Account Not Found',
//        'No account found with this number. Would you like to Sign Up?',
//        [
//          { text: 'Cancel', style: 'cancel' },
//          { text: 'Sign Up', onPress: () => navigation.navigate('Signup') },
//        ]
//      );
//      return;
//    }
//
//    const randomOtp = generateOTP();
//    setGeneratedOtp(randomOtp);
//
//    Alert.alert('OTP Sent ✅', `Your OTP is: ${randomOtp}`);
//
//    setOtpSent(true);
//    setTimer(30);
//    setCanResend(false);
//    setOtp(Array(OTP_LENGTH).fill(''));
//
//    setTimeout(() => {
//      inputs.current[0]?.focus();
//    }, 300);
//  };
//
//  const handleResendOtp = () => {
//    if (!canResend) return;
//
//    const randomOtp = generateOTP();
//    setGeneratedOtp(randomOtp);
//
//    Alert.alert('OTP Resent ✅', `Your OTP is: ${randomOtp}`);
//
//    setTimer(30);
//    setCanResend(false);
//    setOtp(Array(OTP_LENGTH).fill(''));
//
//    setTimeout(() => {
//      inputs.current[0]?.focus();
//    }, 300);
//  };
//
//  // OTP Change
//  const handleOtpChange = (value, index) => {
//    if (!/^\d?$/.test(value)) return;
//
//    const newOtp = [...otp];
//    newOtp[index] = value;
//    setOtp(newOtp);
//
//    if (value && index < OTP_LENGTH - 1) {
//      inputs.current[index + 1]?.focus();
//    }
//  };
//
//  // Backspace (single press fix)
//  const handleKeyPress = (e, index) => {
//    if (e.nativeEvent.key === 'Backspace') {
//      if (otp[index] === '' && index > 0) {
//        inputs.current[index - 1]?.focus();
//      }
//    }
//  };
//
//  const resetOtp = () => {
//    setOtp(Array(OTP_LENGTH).fill(''));
//    setTimeout(() => {
//      inputs.current[0]?.focus();
//    }, 200);
//  };
//
//  // 🔥 LOGIN
//  const handleLogin = async () => {
//    const enteredOtp = otp.join('');
//
//    if (enteredOtp.length !== OTP_LENGTH) {
//      Alert.alert('Error', 'Enter complete 6 digit OTP');
//      return;
//    }
//
//    if (enteredOtp !== generatedOtp) {
//      Alert.alert('Wrong OTP ❌', 'Entered OTP is incorrect');
//      resetOtp();
//      return;
//    }
//
//    try {
//      const user = await getUser();
//
//      if (!user || user.phone !== phone) {
//        Alert.alert('Error', 'User not found. Please sign up.');
//        navigation.navigate('Signup');
//        return;
//      }
//
//      await saveUser({ ...user, isLoggedIn: true });
//
//      Alert.alert('Success 🎉', 'Login Successful');
//      navigation.replace('Landing');
//    } catch (error) {
//      Alert.alert('Error', 'Login failed');
//    }
//  };
//
//  return (
//    <SafeAreaView style={loginStyles.safe}>
//      <KeyboardAvoidingView
//        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//        style={{ flex: 1 }}
//      >
//        <ScrollView contentContainerStyle={loginStyles.container}>
//          <View style={{ flex: 1 }}>
//
//            <Header style={loginStyles.header}>
//              <View style={loginStyles.iconWrap}>
//                <Text style={loginStyles.icon}>💼</Text>
//              </View>
//              <Text style={loginStyles.appTitle}>Digital Business Card</Text>
//              <Text style={loginStyles.subtitle}>
//                Grow your business digitally
//              </Text>
//            </Header>
//
//            <View style={loginStyles.card}>
//              <InputField
//                placeholder="Enter mobile number"
//                value={phone}
//                onChangeText={handlePhoneChange}
//                keyboardType="number-pad"
//                showCountry
//                countryCode="+91"
//                maxLength={10}
//              />
//
//              <PrimaryButton title="Send OTP" onPress={handleSendOtp} />
//
//              {otpSent && (
//                <>
//                  <View style={loginStyles.otpRow}>
//                    {otp.map((digit, index) => (
//                      <TextInput
//                        key={index}
//                        ref={(ref) => (inputs.current[index] = ref)}
//                        style={loginStyles.otpBox}
//                        keyboardType="number-pad"
//                        maxLength={1}
//                        value={digit}
//                        onChangeText={(value) =>
//                          handleOtpChange(value, index)
//                        }
//                        onKeyPress={(e) =>
//                          handleKeyPress(e, index)
//                        }
//                      />
//                    ))}
//                  </View>
//
//                  <TouchableOpacity
//                    onPress={handleResendOtp}
//                    disabled={!canResend}
//                    style={loginStyles.resendWrap}
//                  >
//                    <Text style={loginStyles.resendText}>
//                      {canResend
//                        ? 'Resend OTP'
//                        : `Resend OTP in ${timer}s`}
//                    </Text>
//                  </TouchableOpacity>
//                </>
//              )}
//
//              <PrimaryButton
//                title="Login"
//                onPress={handleLogin}
//                style={loginStyles.loginBtn}
//              />
//
//              <View style={loginStyles.dividerRow}>
//                <View style={loginStyles.line} />
//                <Text style={loginStyles.newHereText}>New here?</Text>
//                <View style={loginStyles.line} />
//              </View>
//
//              <TouchableOpacity
//                style={loginStyles.signupRow}
//                onPress={() => navigation.navigate('Signup')}
//              >
//                <Text style={loginStyles.createText}>Create your account </Text>
//                <Text style={loginStyles.signupText}>Sign Up →</Text>
//              </TouchableOpacity>
//            </View>
//
//          </View>
//        </ScrollView>
//      </KeyboardAvoidingView>
//    </SafeAreaView>
//  );
//}

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

// 🔥 IMPORT YOUR API
import { apiFetch } from '../../utils/api';

const OTP_LENGTH = 6;

export default function LoginScreen({ navigation }) {

  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputs = useRef([]);

  // ================= TIMER =================
  useEffect(() => {
    let interval;

    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }

    if (timer === 0) setCanResend(true);

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // ================= PHONE INPUT =================
  const handlePhoneChange = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);
    setPhone(cleaned);
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {

    if (!/^[1-9]\d{9}$/.test(phone)) {
      Alert.alert('Invalid Number', 'Enter valid 10 digit mobile number');
      return;
    }

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
        setOtp(Array(OTP_LENGTH).fill(''));

        setTimeout(() => {
          inputs.current[0]?.focus();
        }, 300);

      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }

    } catch {
      Alert.alert('Error', 'Network error');
    }
  };

  // ================= RESEND OTP =================
  const handleResendOtp = async () => {

    if (!canResend) return;

    try {

      const { res, data } = await apiFetch('/auth/resend/login-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: phone }),
      });

      if (res.ok && data.status === 1) {

        Alert.alert('OTP Resent ✅');

        setTimer(30);
        setCanResend(false);
        setOtp(Array(OTP_LENGTH).fill(''));

        setTimeout(() => {
          inputs.current[0]?.focus();
        }, 300);

      } else {
        Alert.alert('Error', data.message || 'Failed');
      }

    } catch {
      Alert.alert('Error', 'Network error');
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

        Alert.alert('Success 🎉', 'Login Successful');
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

              <PrimaryButton title="Send OTP" onPress={handleSendOtp} />

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
                    disabled={!canResend}
                    style={loginStyles.resendWrap}
                  >
                    <Text style={loginStyles.resendText}>
                      {canResend
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