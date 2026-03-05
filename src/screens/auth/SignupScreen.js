import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import InputField from '../../components/form/InputField';
import OtpInput from '../../components/form/OtpInput';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { COLORS } from '../../styles/colors';
import { signupStyles } from '../../styles/screens/signupStyles';
//import { saveUser } from "../../utils/storage";
import { apiFetch } from "../../utils/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
  const [otpVisiblePhone, setOtpVisiblePhone] = useState(false);
  const [otpVisibleEmail, setOtpVisibleEmail] = useState(false);
  const [timerPhone, setTimerPhone] = useState(30);
  const [timerEmail, setTimerEmail] = useState(30);
  // frontend OTP generation removed; backend will send/verify OTPs
  const [otpPhoneVerified, setOtpPhoneVerified] = useState(false);
  const [otpEmailVerified, setOtpEmailVerified] = useState(false);
  const [wrongOtpPhoneCooldown, setWrongOtpPhoneCooldown] = useState(0);
  const [wrongOtpEmailCooldown, setWrongOtpEmailCooldown] = useState(0);

  const [form, setForm] = useState({
    first: '',
    middle: '',
    last: '',
    phone: '',
    email: '',
    otpPhone: '',
    otpEmail: '',
  });

  const [errors, setErrors] = useState({});

  const validPhone = (v) => /^[1-9]\d{9}$/.test(v);
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

  useEffect(() => {
    let i;
    if (otpVisiblePhone && timerPhone > 0) {
      i = setInterval(() => setTimerPhone((t) => t - 1), 1000);
    }
    return () => clearInterval(i);
  }, [otpVisiblePhone, timerPhone]);

  useEffect(() => {
    let i;
    if (otpVisibleEmail && timerEmail > 0) {
      i = setInterval(() => setTimerEmail((t) => t - 1), 1000);
    }
    return () => clearInterval(i);
  }, [otpVisibleEmail, timerEmail]);

  useEffect(() => {
    let cooldownInterval;
    if (wrongOtpPhoneCooldown > 0) {
      cooldownInterval = setInterval(() => setWrongOtpPhoneCooldown((t) => t - 1), 1000);
    }
    return () => clearInterval(cooldownInterval);
  }, [wrongOtpPhoneCooldown]);

  useEffect(() => {
    let cooldownInterval;
    if (wrongOtpEmailCooldown > 0) {
      cooldownInterval = setInterval(() => setWrongOtpEmailCooldown((t) => t - 1), 1000);
    }
    return () => clearInterval(cooldownInterval);
  }, [wrongOtpEmailCooldown]);

  const validate = (name, value) => {
    let msg = '';

    if (name === 'first' && value.length < 2) msg = 'Enter valid first name';
    if (name === 'middle' && value && value.length < 2) msg = 'Only letters allowed';
    if (name === 'last' && value.length < 2) msg = 'Enter valid last name';
    if (name === 'phone' && !validPhone(value)) msg = 'Enter valid 10 digit number';
    if (name === 'email' && value && !validEmail(value)) msg = 'Enter valid email';
    if (name === 'otpPhone' && value.length !== 6) msg = 'Enter 6 digit OTP';
    if (name === 'otpEmail' && value.length !== 6) msg = 'Enter 6 digit OTP';

    setErrors((p) => ({ ...p, [name]: msg }));
  };

  const handleChange = (name, value) => {
    let clean = value;

    if (name === 'first' || name === 'middle')
      clean = value.replace(/[^A-Za-z]/g, '').slice(0, 15);

    if (name === 'last') {
      clean = value.replace(/[^A-Za-z ]/g, '');
      if ((clean.match(/ /g) || []).length > 1) return;
      clean = clean.slice(0, 10);
    }

    if (name === 'phone')
      clean = value.replace(/\D/g, '').slice(0, 10);

    if (name === 'otpPhone' || name === 'otpEmail')
      clean = value.replace(/\D/g, '').slice(0, 6);

    setForm((p) => ({ ...p, [name]: clean }));
    validate(name, clean);
    if (name === 'otpPhone') setOtpPhoneVerified(false);
    if (name === 'otpEmail') setOtpEmailVerified(false);
  };

  const formValid =
    form.first.length >= 2 &&
    form.last.length >= 2 &&
    validPhone(form.phone) &&
    (!form.email || validEmail(form.email)) &&
    !errors.first &&
    !errors.last &&
    !errors.phone &&
    !errors.email;

  const phoneValid = validPhone(form.phone) && !errors.phone;
  const emailValid = !form.email || (validEmail(form.email) && !errors.email);

  const canSubmit =
    form.first.length >= 2 &&
    form.last.length >= 2 &&
    phoneValid &&
    emailValid &&
    form.otpPhone.length === 6 &&
    (!form.email || form.otpEmail.length === 6) &&
    !errors.first &&
    !errors.last &&
    !errors.phone &&
    !errors.email &&
    otpPhoneVerified &&
    (!form.email || otpEmailVerified);

//  const handleValidateOtpPhone = () => {
//    if (wrongOtpPhoneCooldown > 0) {
//      Alert.alert('Please Wait', `You can request OTP again in ${wrongOtpPhoneCooldown} seconds`);
//      return;
//    }
//    if (!phoneValid) {
//      Alert.alert('Error', 'Enter a valid phone number');
//      return;
//    }
//    setOtpPhoneVerified(false);
//    const randomOtp = generateOTP(6).toString();
//    setGeneratedOtpPhone(randomOtp);
//    Alert.alert('Phone OTP', `Your phone OTP is ${randomOtp}`);
//    setOtpVisiblePhone(true);
//    setTimerPhone(30);
//    setWrongOtpPhoneCooldown(0);
//  };

  const handleValidateOtpPhone = async () => {

    if (wrongOtpPhoneCooldown > 0) {
      Alert.alert('Please Wait', `You can request OTP again in ${wrongOtpPhoneCooldown} seconds`);
      return;
    }

    if (!phoneValid) {
      Alert.alert('Error', 'Enter a valid phone number');
      return;
    }

    try {

      setOtpPhoneVerified(false);

      const { res, data } = await apiFetch('/auth/mobile-signup', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: Number(form.phone) }),
      });
      if (res && res.ok && data && data.status === 1) {
        setOtpVisiblePhone(true);
        setTimerPhone(30);
        setWrongOtpPhoneCooldown(0);
        Alert.alert('Success', 'OTP sent to mobile');
      } else {
        console.log('mobile-signup failed', { resStatus: res?.status, data });
        Alert.alert('Error', data?.message || `Unable to send mobile OTP (status ${res?.status || 'unknown'})`);
      }

    } catch (error) {
      Alert.alert('Network Error', error.message || 'Unable to send OTP');
    }
  };
  const handleValidateOtpEmail = async () => {
    if (wrongOtpEmailCooldown > 0) {
      Alert.alert('Please Wait', `You can request OTP again in ${wrongOtpEmailCooldown} seconds`);
      return;
    }
    if (!form.email) {
      // If no email provided, skip OTP verification
      setOtpEmailVerified(true);
      return;
    }
    if (!emailValid) {
      Alert.alert('Error', 'Enter a valid email');
      return;
    }

    try {
      // Request backend to send email OTP
      const payload = { email: form.email.trim() };

      const { res, data } = await apiFetch('/auth/send-email-otp', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res && res.ok && data && data.status === 1) {
        setOtpVisibleEmail(true);
        setTimerEmail(30);
        setWrongOtpEmailCooldown(0);
        Alert.alert('Success', 'OTP sent to email');
      } else {
        console.log('email-otp failed', { resStatus: res?.status, data });
        Alert.alert('Error', data?.message || `Unable to send email OTP (status ${res?.status || 'unknown'})`);
      }
    } catch (e) {
      Alert.alert('Network Error', e.message || 'Unable to send email OTP');
    }
  };

  const handleResendPhoneOtp = () => {
    if (wrongOtpPhoneCooldown > 0) {
      Alert.alert('Please Wait', `You can resend OTP again in ${wrongOtpPhoneCooldown} seconds`);
      return;
    }
    if (otpPhoneVerified) return;
    if (!phoneValid) {
      Alert.alert('Error', 'Enter a valid phone number');
      return;
    }
    // Request resend from backend
    (async () => {
      try {
        setOtpPhoneVerified(false);
        const { res, data } = await apiFetch('/auth/mobile-signup', {
          method: 'POST',
          body: JSON.stringify({ mobileNumber: Number(form.phone) }),
        });

        if (res && res.ok && data && data.status === 1) {
          setOtpVisiblePhone(true);
          setTimerPhone(30);
            Alert.alert('Success', 'OTP resent to mobile');
        } else {
          console.log('mobile-signup resend failed', { resStatus: res?.status, data });
          Alert.alert('Error', data?.message || `Unable to resend OTP (status ${res?.status || 'unknown'})`);
        }
      } catch (e) {
          Alert.alert('Network Error', e.message || 'Unable to resend OTP');
      }
    })();
  };

  const handleResendEmailOtp = () => {
    if (wrongOtpEmailCooldown > 0) {
      Alert.alert('Please Wait', `You can resend OTP again in ${wrongOtpEmailCooldown} seconds`);
      return;
    }
    if (otpEmailVerified) return;
    if (!form.email) {
      // If no email provided, just mark as verified
      setOtpEmailVerified(true);
      return;
    }
    if (!emailValid) {
      Alert.alert('Error', 'Enter a valid email');
      return;
    }
    // Trigger backend resend for email OTP
    (async () => {
      try {
        setOtpEmailVerified(false);
        const payload = { email: form.email.trim() };

        const { res, data } = await apiFetch('/auth/send-email-otp', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (res && res.ok && data && data.status === 1) {
          setOtpVisibleEmail(true);
          setTimerEmail(30);
          setWrongOtpEmailCooldown(0);
          Alert.alert('Success', 'OTP resent to email');
        } else {
          console.log('email-otp resend failed', { resStatus: res?.status, data });
          Alert.alert('Error', data?.message || `Unable to resend email OTP (status ${res?.status || 'unknown'})`);
        }
      } catch (e) {
          Alert.alert('Network Error', e.message || 'Unable to resend email OTP');
      }
    })();
  };

//  const handleVerifyPhoneOtp = () => {
//    if (form.otpPhone === generatedOtpPhone) {
//      setOtpPhoneVerified(true);
//      Alert.alert('Verified', 'Phone OTP verified');
//    } else {
//      setOtpPhoneVerified(false);
//      setForm((p) => ({ ...p, otpPhone: '' }));
//      setWrongOtpPhoneCooldown(30);
//      Alert.alert('Invalid', 'Phone OTP is incorrect. Try again after 30 seconds');
//    }
//  };

  const handleVerifyPhoneOtp = async () => {

    try {

      // POST /auth/verify-phone-otp
      const { res, data } = await apiFetch('/auth/verify-phone-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: Number(form.phone), otp: form.otpPhone }),
      });

      if (res && res.ok && data && data.status === 1) {
        // Mark phone OTP as verified. Do NOT create account or navigate here.
        setOtpPhoneVerified(true);
        try {
          await AsyncStorage.setItem('userPhone', form.phone);
        } catch (e) {
          console.warn('Failed to save userPhone', e);
        }
        Alert.alert('Success', 'Phone OTP Verified');
      } else {
        console.log('verify-phone-otp failed', { resStatus: res?.status, data });
        setWrongOtpPhoneCooldown(30);
        Alert.alert('Error', data?.message || `Phone OTP verification failed (status ${res?.status || 'unknown'})`);
      }

    } catch (error) {
      Alert.alert('Verification Failed');
    }
  };
  const handleVerifyEmailOtp = async () => {
    try {
      const payload = { email: form.email.trim(), otp: form.otpEmail };

      const { res, data } = await apiFetch('/auth/verify-email-otp', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res && res.ok && data && data.status === 1) {
        setOtpEmailVerified(true);
        Alert.alert('Success', 'Email OTP Verified');
      } else {
        console.log('verify-email-otp failed', { resStatus: res?.status, data });
        setOtpEmailVerified(false);
        setForm((p) => ({ ...p, otpEmail: '' }));
        setWrongOtpEmailCooldown(30);
        Alert.alert('Error', data?.message || `Email OTP invalid. Try again after 30 seconds (status ${res?.status || 'unknown'})`);
      }
    } catch (e) {
      Alert.alert('Verification Failed');
    }
  };

  // ✅ SAVE USER DATA ON SIGNUP
  const handleSubmit = async () => {
    // Ensure OTP verifications are done before attempting to register
    if (!otpPhoneVerified) {
      Alert.alert('OTP Required', 'Please verify your phone OTP before creating an account');
      return;
    }

    if (form.email && !otpEmailVerified) {
      Alert.alert('OTP Required', 'Please verify your email OTP before creating an account');
      return;
    }

    try {
      const payload = {
        firstName: form.first,
        middleName: form.middle,
        lastName: form.last,
        mobileNumber: Number(form.phone),
        email: form.email?.trim() || null,
      };
      // POST /auth/final-submit
      const { res, data } = await apiFetch('/auth/final-submit', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res && res.ok && data && data.status === 1) {
        try {
          await AsyncStorage.setItem('userPhone', form.phone);
          if (data.userId) {
            await AsyncStorage.setItem('loggedInUserId', String(data.userId));
          }
        } catch (e) {
          console.warn('Failed to save session after signup', e);
        }
        Alert.alert('Success', 'Account Created', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ]);
      } else {
        console.log('final-submit failed', { resStatus: res?.status, data });
        Alert.alert('Error', data?.message || `Registration failed (status ${res?.status || 'unknown'})`);
      }
    } catch (error) {
      console.log('register exception', error);
      Alert.alert('Network Error', error.message || 'Failed to create account');
    }
  };

  return (
    <SafeAreaView style={signupStyles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[{ flexGrow: 1 }, signupStyles.scroll]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <Header style={signupStyles.header}>
            <TouchableOpacity
              style={signupStyles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            <Text style={signupStyles.title}>Create Account</Text>
            <Text style={signupStyles.subtitle}>Join us today</Text>
          </Header>

          <View style={signupStyles.card}>
            {/* Inputs unchanged */}
            <InputField label="First Name" required icon="person-outline" placeholder="Enter first name"
              value={form.first} onChangeText={(v) => handleChange('first', v)} error={errors.first} />

            <InputField label="Middle Name (optional)" icon="person-outline" placeholder="Enter middle name"
              value={form.middle} onChangeText={(v) => handleChange('middle', v)} error={errors.middle} />

            <InputField label="Last Name" required icon="person-outline" placeholder="Enter last name"
              value={form.last} onChangeText={(v) => handleChange('last', v)} error={errors.last} />

            <InputField
              label="Mobile Number"
              required
              icon="call-outline"
              showCountry
              countryCode="+91"
              placeholder="Enter mobile number"
              value={form.phone}
              onChangeText={(v) => handleChange('phone', v)}
              error={errors.phone}
              keyboardType="number-pad"
              rightButton={
                otpPhoneVerified
                  ? { label: '✔ Verified', disabled: true }
                  : {
                    label: 'Send OTP',
                    onPress: handleValidateOtpPhone,
                    disabled: !phoneValid,
                  }
              }
            />

            {/* {otpVisiblePhone && (
              <>
                <OtpInput
                  length={6}
                  value={form.otpPhone}
                  onChangeText={(v) => handleChange('otpPhone', v)}
                  rightButton={{
                    label: otpPhoneVerified ? 'Verified' : 'Verify',
                    onPress: handleVerifyPhoneOtp,
                    disabled: form.otpPhone.length !== 6 || otpPhoneVerified,
                  }}
                />

                {!otpPhoneVerified && (
                  <TouchableOpacity onPress={handleResendPhoneOtp} disabled={timerPhone > 0}>
                    <Text style={signupStyles.resend}>
                      {timerPhone > 0 ? `Resend OTP in ${timerPhone}s` : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )} */}
            {/* {otpVisiblePhone && (
  <>
    <OtpInput
      length={6}
      value={form.otpPhone}
      onChangeText={(v) => handleChange('otpPhone', v)}
    />

    {!otpPhoneVerified && (
      <PrimaryButton
        title="Verify Phone OTP"
        onPress={handleVerifyPhoneOtp}
        disabled={form.otpPhone.length !== 6}
        style={{ marginTop: 10 }}
      />
    )}

    {otpPhoneVerified && (
      <Text style={{ color: 'green', marginTop: 8 }}>
         Phone Verified
      </Text>
    )}

    {!otpPhoneVerified && (
      <TouchableOpacity onPress={handleResendPhoneOtp} disabled={timerPhone > 0}>
        <Text style={signupStyles.resend}>
          {timerPhone > 0 ? `Resend OTP in ${timerPhone}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    )}
  </>
)} */}
            {otpVisiblePhone && !otpPhoneVerified && (
              <>
                <OtpInput
                  length={6}
                  value={form.otpPhone}
                  onChangeText={(v) => handleChange('otpPhone', v)}
                />

                <PrimaryButton
                  title="Verify Phone OTP"
                  onPress={handleVerifyPhoneOtp}
                  disabled={form.otpPhone.length !== 6}
                  style={{ marginTop: 10 }}
                />

                <TouchableOpacity
                  onPress={handleResendPhoneOtp}
                  disabled={timerPhone > 0}
                >
                  <Text style={signupStyles.resend}>
                    {timerPhone > 0
                      ? `Resend OTP in ${timerPhone}s`
                      : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              </>
            )}



            <InputField
              label="Email (optional)"
              icon="mail-outline"
              placeholder="Enter email"
              value={form.email}
              onChangeText={(v) => handleChange('email', v)}
              error={errors.email}
              keyboardType="email-address"
              rightButton={
                form.email ? (
                  otpEmailVerified
                    ? { label: '✔ Verified', disabled: true }
                    : {
                      label: 'Send OTP',
                      onPress: handleValidateOtpEmail,
                      disabled: !emailValid,
                    }
                ) : null
              }
            />

            {otpVisibleEmail && form.email && !otpEmailVerified && (
              <>
                <OtpInput
                  length={6}
                  value={form.otpEmail}
                  onChangeText={(v) => handleChange('otpEmail', v)}
                />

                <PrimaryButton
                  title="Verify Email OTP"
                  onPress={handleVerifyEmailOtp}
                  disabled={form.otpEmail.length !== 6}
                  style={{ marginTop: 10 }}
                />

                <TouchableOpacity
                  onPress={handleResendEmailOtp}
                  disabled={timerEmail > 0}
                >
                  <Text style={signupStyles.resend}>
                    {timerEmail > 0
                      ? `Resend OTP in ${timerEmail}s`
                      : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              </>
            )}


            <PrimaryButton
              title="Submit"
              onPress={handleSubmit}
              disabled={!canSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

