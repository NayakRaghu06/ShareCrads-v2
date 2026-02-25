import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { layoutStyles } from '../../styles/screens/personalDetailsLayoutStyles';
import { formStyles } from '../../styles/screens/personalDetailsFormStyles';
// import { getUser, saveDashboard } from '../../utils/storage';
import Footer from '../../components/common/Footer';
import { saveOrUpdateUser, getUser } from '../../database/userQueries';// Validation rules
const validations = {
  fullName: {
    minLength: 2,
    lettersOnly: true,
    required: true,
    message: 'Name must be at least 2 characters with letters only',
  },
  phone1: {
    exactLength: 10,
    numbersOnly: true,
    required: true,
    message: 'Phone must be 10 digits',
  },
  phone2: {
    exactLength: 10,
    numbersOnly: true,
    required: false,
    message: 'Phone must be 10 digits',
  },
  email: {
    required: true,
    emailFormat: true,
    message: 'Enter valid email format',
  },
  designation: {
    maxLength: 40,
    required: false,
    message: 'Designation cannot exceed 40 characters',
  },
  address: {
    required: true,
    message: 'Address is required',
  },
};

// Validation helper functions
const validate = {
  name: (value) => {
    if (!value.trim()) return false;
    return /^[a-zA-Z\s]{2,}$/.test(value.trim());
  },
  phone: (value) => {
    return /^[0-9]{10}$/.test(value.replace(/\D/g, ''));
  },
  email: (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
};

export default function PersonalDetailsScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    phone: '',
    email: '',
    address: '',
  });

  const [userInitial, setUserInitial] = useState('N');

  //  useEffect(() => {
  //     let mounted = true;
  //     const loadUser = async () => {
  //       try {
  //         const user = await getUser();
  //         if (mounted && user) {
  //           const name = user.first || user.fullName || user.firstName || '';
  //           const initial = name && name.trim().length ? name.trim().charAt(0).toUpperCase() : 'N';
  //           setUserInitial(initial);
  //         }
  //       } catch (e) {
  //         // ignore
  //       }
  //     };
  //     loadUser();
  //     return () => {
  //       mounted = false;
  //     };
  //   }, []); 


  const [errors, setErrors] = useState({});

  // Validate single field
  const validateField = (name, value) => {
    const rule = validations[name];
    if (!rule) return '';

    if (rule.required && !value.trim()) {
      return `${name.replace(/([A-Z])/g, ' $1').trim()} is required`;
    }

    if (!rule.required && !value.trim()) {
      return ''; // Optional field is OK if empty
    }

    if (name === 'fullName') {
      if (value.trim().length < rule.minLength) {
        return `Name must be at least ${rule.minLength} characters`;
      }
      if (!/^[a-zA-Z\s]{2,}$/.test(value.trim())) {
        return 'Name must contain letters only';
      }
    }

    if (name === 'phone1' || name === 'phone2') {
      const digits = value.replace(/\D/g, '');
      if (value && digits.length !== rule.exactLength) {
        return `Phone must be exactly ${rule.exactLength} digits`;
      }
      if (value && !/^[0-9]*$/.test(digits)) {
        return 'Phone must contain numbers only';
      }
    }

    if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Enter valid email format';
      }
    }

    if (name === 'designation') {
      if (value.length > rule.maxLength) {
        return `Designation cannot exceed ${rule.maxLength} characters`;
      }
    }

    return '';
  };

  // Handle field change
  const handleFieldChange = (name, value) => {
    let cleanedValue = value;
    if (name === 'name') {
      cleanedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
    } else if (name === 'phone') {
      cleanedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'designation') {
      cleanedValue = value.slice(0, 40);
    }
    setFormData({ ...formData, [name]: cleanedValue });
    const error = validateField(name, cleanedValue);
    setErrors({ ...errors, [name]: error });
  };

  // Validate all fields before saving
  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateAllFields()) {
      Alert.alert('Success', 'Form data validated successfully');
      console.log('Form Data:', formData);
    } else {
      Alert.alert('Validation Error', 'Please fix all errors before proceeding');
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToBusinessDetails = () => {
    const personalData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      designation: formData.designation,
      address: formData.address,
    };
    navigation.navigate('BusinessDetails', { personalData });
  };

  const navigateToLanding = () => {
    navigation.navigate('Landing');
  };

  return (
    <SafeAreaView style={layoutStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >

        {/* ========== HEADER SECTION ========== */}
        <View style={layoutStyles.headerSection}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={navigateToLanding}
            style={{ width: 24, justifyContent: 'center', alignItems: 'center' }}
          >
            <Ionicons name="chevron-back" size={28} color="#D4AF37" />
          </TouchableOpacity>

          {/* App Title */}
          <Text style={layoutStyles.appTitle}>
            DIGITAL BUSINESS CARD
          </Text>

          {/* Profile Icon */}
          <TouchableOpacity
            style={layoutStyles.profileIcon}
            onPress={navigateToProfile}
          >
            <Text style={layoutStyles.profileIconText}>{userInitial}</Text>
          </TouchableOpacity>
        </View>

        {/* ========== TITLE SECTION ========== */}
        <View style={layoutStyles.titleSection}>
          <Text style={layoutStyles.mainTitle}>
            Digital Business Card Creator
          </Text>
          <Text style={layoutStyles.subtitle}>
            Create your professional digital business card in minutes
          </Text>
        </View>

        {/* ========== FORM CARD SECTION ========== */}
        <View style={layoutStyles.formCard}>

          {/* Profile Information Header */}
          <View style={layoutStyles.cardHeader}>
            <Text style={layoutStyles.cardTitle}>Step 1 of 3</Text>
            <Text style={layoutStyles.cardSubtitle}>
              All fields marked with * are mandatory
            </Text>
          </View>

          {/* Personal Details Section */}
          <View style={layoutStyles.detailsSection}>
            <Text style={layoutStyles.sectionTitle}>Personal Details</Text>

            {/* Name */}
            <InputField
              label="Name *"
              placeholder="Enter your name"
              icon="person"
              value={formData.name}
              onChangeText={(text) => handleFieldChange('name', text)}
              error={errors.name}
            />

            {/* Designation */}
            <InputField
              label="Designation (max 40 chars)"
              placeholder="Enter designation"
              icon="briefcase"
              value={formData.designation}
              onChangeText={(text) => handleFieldChange('designation', text)}
              error={errors.designation}
            />

            {/* Phone Number */}
            <InputField
              label="Phone Number * (10 digits)"
              placeholder="10-digit phone number"
              icon="call"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleFieldChange('phone', text)}
              error={errors.phone}
              maxLength={10}
            />

            {/* Email */}
            <InputField
              label="Email *"
              placeholder="your.email@gmail.com"
              icon="mail"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleFieldChange('email', text)}
              error={errors.email}
            />

            {/* Address */}
            <InputField
              label="Address *"
              placeholder="Enter address"
              icon="location"
              multiline
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              error={errors.address}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={layoutStyles.saveButton}
            onPress={async () => {
              if (validateAllFields()) {
                saveOrUpdateUser(formData);

                // 🔥 SEE STORED DATA IN TERMINAL
                const stored = require('../../database/userQueries').getUser();
                console.log("📦 Stored Data:", stored);

                navigateToBusinessDetails();
              } else {
                Alert.alert('Validation Error', 'Please fix all errors before proceeding');
              }
            }}
          >
            <Ionicons name="checkmark-done" size={18} color="#0F0F0F" />
            <Text style={layoutStyles.saveButtonText}>Step 2: Business Details</Text>
          </TouchableOpacity>

          {/* Preview Templates removed from this step (moved to Final Preview) */}

          {/* Next Step Button */}
          <TouchableOpacity
            style={layoutStyles.skipButton}
            onPress={navigateToLanding}
          >
            <Ionicons name="arrow-back" size={18} color="#D4AF37" />
            <Text style={layoutStyles.skipButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
      {/* <Footer activeTab="" navigation={navigation} fromScreen="PersonalDetails" /> */}
    </SafeAreaView>
  );
}

function InputField({ label, placeholder, icon, multiline, keyboardType, value, onChangeText, maxLength, error }) {
  const renderLabel = () => {
    if (!label) return null;

    const parts = label.split('*');

    if (parts.length === 1) {
      // No asterisk
      return <Text style={formStyles.label}>{label}</Text>;
    }

    return (
      <Text style={formStyles.label}>
        {parts[0]}
        <Text style={{ color: '#EF4444', fontWeight: '700' }}>*</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <View style={formStyles.inputWrapper}>
      {renderLabel()}
      <View style={[
        formStyles.inputContainer,
        multiline && formStyles.addressInputContainer,
        error && { borderColor: '#EF4444', borderWidth: 2 }
      ]}>
        <Ionicons
          name={icon}
          size={20}
          color={error ? '#EF4444' : '#D4AF37'}
          style={[formStyles.inputIcon, multiline && formStyles.addressIcon]}
        />
        <TextInput
          style={[
            formStyles.input,
            multiline && formStyles.addressInput,
            error && { color: '#EF4444' }
          ]}
          placeholder={placeholder}
          placeholderTextColor={error ? '#FCA5A5' : '#A0AEC0'}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      {error && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={{ color: '#EF4444', fontSize: 12, marginLeft: 4, fontWeight: '500' }}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}
