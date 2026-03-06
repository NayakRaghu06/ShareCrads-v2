
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { layoutStyles } from '../../styles/screens/socialMediaStyles';
import { formStyles } from '../../styles/screens/socialMediaStyles';
import AppHeader from '../../components/common/AppHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileAvatarUpload from '../../components/common/ProfileAvatarUpload';
import LogoUploadCard from '../../components/common/LogoUploadCard';
import AnimatedFormItem from '../../components/common/AnimatedFormItem';
import AnimatedPressable from '../../components/common/AnimatedPressable';
// template previews moved to TemplatePreview flow

// Validation rules
const validations = {
  whatsapp: {
    exactLength: 10,
    numbersOnly: true,
    required: false,
  },
  instagram: {
    noSpaces: true,
    required: false,
  },
  linkedin: {
    urlFormat: true,
    required: false,
  },
  twitter: {
    usernameFormat: true,
    required: false,
  },
  facebook: {
    urlFormat: true,
    required: false,
  },
  // website: {
  //   urlFormat: true,
  //   required: false,
  // },
};

export default function SocialMediaScreen({ route, navigation }) {
  const { cardData = {} } = route.params || {};

  const [formData, setFormData] = useState({
    whatsapp: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    facebook: '',
    // website: '',
    companyLogo: null,
    profilePhoto: null,
  });

  const [errors, setErrors] = useState({});
  const underlineAnim = useRef(new Animated.Value(0)).current;

  // ================================
  // IMAGE PICKER FUNCTION (WORKING)
  // ================================
  const handleImagePicker = async (field) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow gallery access to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0].uri;

        setFormData((prev) => ({
          ...prev,
          [field]: selectedImage,
        }));
      }
    } catch (error) {
      console.log("Image Picker Error:", error);
      Alert.alert("Error", "Something went wrong while selecting image");
    }
  };

  const handleRemoveImage = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  // ================================
  // VALIDATION
  // ================================
  const validateField = (name, value) => {
    if (!value?.trim()) return '';

    if (name === 'whatsapp') {
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 10) return 'WhatsApp must be exactly 10 digits';
      if (!/^[0-9]*$/.test(digits)) return 'WhatsApp must contain numbers only';
    }

    if (name === 'instagram') {
      if (/\s/.test(value)) return 'Instagram username cannot contain spaces';
    }

    if (name === 'linkedin') {
      if (!/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(value)) {
        return 'Enter valid LinkedIn URL';
      }
    }

    if (name === 'twitter') {
      const handle = value.startsWith('@') ? value.slice(1) : value;
      if (!/^[A-Za-z0-9_]+$/.test(handle)) {
        return 'Twitter can only contain letters, numbers, and underscore';
      }
      if (handle.length > 15) {
        return 'Twitter username must be max 15 characters';
      }
    }

    if (name === 'facebook') {
      if (!/^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9.]+\/?$/.test(value)) {
        return 'Enter valid Facebook profile URL';
      }
    }

    // if (name === 'website') {
    //   if (!/^https?:\/\/.+\..+/.test(value)) {
    //     return 'Enter valid website URL';
    //   }
    // }

    return '';
  };

  const handleFieldChange = (name, value) => {
    let cleanedValue = value;

    if (name === 'whatsapp') {
      cleanedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'instagram') {
      cleanedValue = value.replace(/\s/g, '');
    } else if (name === 'twitter') {
      cleanedValue = value.replace(/\s/g, '').slice(0, 16);
    }

    setFormData({ ...formData, [name]: cleanedValue });

    const error = validateField(name, cleanedValue);
    setErrors({ ...errors, [name]: error });
  };

  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validations).forEach((field) => {
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
      // Map upload field names to template/user keys so templates receive expected props
      const uploadMap = {
        // templates expect `profileImage` for avatar
        profileImage: formData.profilePhoto || cardData.profileImage || cardData.profilePhoto || null,
        // company logo
        companyLogo: formData.companyLogo || cardData.companyLogo || cardData.logoImage || null,
      };

      const socialFields = {
        whatsapp: formData.whatsapp || cardData.whatsapp || cardData.whatsappNumber || null,
        linkedin: formData.linkedin || cardData.linkedin || null,
        instagram: formData.instagram || cardData.instagram || null,
        twitter: formData.twitter || cardData.twitter || null,
        facebook: formData.facebook || cardData.facebook || null,
        // website: formData.website || cardData.website || null,
      };

      const finalCardData = {
        ...cardData,
        ...uploadMap,
        ...socialFields,
      };

      // Build QR payload from merged data
      const qrPayload = {
        name: finalCardData.name || finalCardData.fullName || finalCardData.firstName || null,
        designation: finalCardData.designation || finalCardData.role || null,
        companyName: finalCardData.companyName || finalCardData.company || null,
        phone: finalCardData.phone || finalCardData.whatsapp || null,
        email: finalCardData.email || null,
        address: finalCardData.address || null,
        description: finalCardData.businessDescription || finalCardData.description || null,
        social: {
          whatsapp: finalCardData.whatsapp || null,
          linkedin: finalCardData.linkedin || null,
          instagram: finalCardData.instagram || null,
          // website: finalCardData.website || null,
        },
        logo: finalCardData.companyLogo || null,
      };

      // Do not auto-generate QR. Attach merged data and navigate to template picker.
      navigation.navigate('TemplatePreview', { cardData: finalCardData });
    } else {
      Alert.alert('Validation Error', 'Please fix all errors');
    }
  };

  // Preload any existing images from incoming cardData so previews show existing photos
  React.useEffect(() => {
    if (!cardData) return;
    setFormData((prev) => {
      const next = {
        ...prev,
        companyLogo: cardData.companyLogo || cardData.logoImage || prev.companyLogo,
        profilePhoto: cardData.profileImage || cardData.profilePhoto || prev.profilePhoto,
        whatsapp: cardData.whatsapp || cardData.phone || prev.whatsapp,
        linkedin: cardData.linkedin || prev.linkedin,
        instagram: cardData.instagram || prev.instagram,
        twitter: cardData.twitter || prev.twitter,
        facebook: cardData.facebook || prev.facebook,
        // website: cardData.website || prev.website,
      };

      // Avoid updating state if nothing changed (prevents infinite loops when cardData reference changes)
      const keys = Object.keys(next);
      const isSame = keys.every((k) => next[k] === prev[k]);
      return isSame ? prev : next;
    });
  }, [cardData]);

  // Auto-populate whatsapp from stored userPhone
  React.useEffect(() => {
    const loadPhone = async () => {
      try {
        const phone = await AsyncStorage.getItem('userSession');
        if (phone) {
          setFormData((prev) => ({ ...prev, whatsapp: phone }));
        }
      } catch (e) {
        // ignore
      }
    };
    loadPhone();
  }, []);

  React.useEffect(() => {
    Animated.timing(underlineAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [underlineAnim]);

  const navigateToBusinessDetails = () => {
    navigation.goBack();
  };

  // Custom back handler for header
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={layoutStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ========== TITLE SECTION ========== */}
        <View style={layoutStyles.titleSection}>
          {/* <Text style={layoutStyles.mainTitle}>
          Digital Business Card Creator
        </Text> */}
          <Text style={layoutStyles.subtitle}>
            Create your professional digital business card in minutes
          </Text>
        </View>

        {/* ========== FORM CARD SECTION ========== */}
        <View style={layoutStyles.formCard}>

          {/* Business Details Header */}
          <View style={layoutStyles.cardHeader}>
            <Text style={layoutStyles.cardTitle}>Step 2 of 3</Text>
            <Text style={layoutStyles.cardSubtitle}>
              All fields marked with * are mandatory
            </Text>
            <Animated.View
              style={[
                layoutStyles.stepUnderline,
                {
                  width: underlineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '38%'],
                  }),
                },
              ]}
            />
          </View>

          {/* <Text style={layoutStyles.sectionTitle}>
          Social Media & Contact Links
        </Text> */}

          <AnimatedFormItem index={0}>
            <InputField
              label="WhatsApp (Optional, 10 digits)"
              placeholder="Mobile number"
              icon="logo-whatsapp"
              keyboardType="phone-pad"
              value={formData.whatsapp}
              onChangeText={(text) => handleFieldChange('whatsapp', text.replace(/[^0-9]/g, '').slice(0, 10))}
              error={errors.whatsapp}
              maxLength={10}
              editable={true}
            />
          </AnimatedFormItem>

          <AnimatedFormItem index={1}>
            <InputField
              label="LinkedIn (Optional)"
              placeholder="https://linkedin.com/in/yourprofile"
              icon="logo-linkedin"
              value={formData.linkedin}
              onChangeText={(text) => handleFieldChange('linkedin', text)}
              error={errors.linkedin}
            />
          </AnimatedFormItem>

          <AnimatedFormItem index={2}>
            <InputField
              label="Website (Optional)"
              placeholder="Website URL"
              icon="globe-outline"
              value={formData.instagram}
              onChangeText={(text) => handleFieldChange('instagram', text)}
              error={errors.instagram}
            />
          </AnimatedFormItem>

          <AnimatedFormItem index={3}>
            <InputField
              label="Twitter (Optional)"
              placeholder="@username"
              icon="logo-twitter"
              value={formData.twitter}
              onChangeText={(text) => handleFieldChange('twitter', text)}
              error={errors.twitter}
              maxLength={16}
            />
          </AnimatedFormItem>

          <AnimatedFormItem index={4}>
            <InputField
              label="Facebook (Optional)"
              placeholder="https://facebook.com/username"
              icon="logo-facebook"
              value={formData.facebook}
              onChangeText={(text) => handleFieldChange('facebook', text)}
              error={errors.facebook}
            />
          </AnimatedFormItem>

          {/* <InputField
            label="Website (Optional)"
            placeholder="https://example.com"
            icon="globe"
            value={formData.website}
            onChangeText={(text) => handleFieldChange('website', text)}
            error={errors.website}
          /> */}

          {/* ================= UPLOAD SECTION ================= */}

          <Text style={layoutStyles.sectionTitle}>Media Uploads</Text>

          <AnimatedFormItem index={5}>
            <ProfileAvatarUpload
              label="Profile Photo"
              imageUri={formData.profilePhoto}
              onPress={() => handleImagePicker('profilePhoto')}
              onRemovePress={() => handleRemoveImage('profilePhoto')}
              size={110}
              centered
            />
          </AnimatedFormItem>

          <AnimatedFormItem index={6}>
            <LogoUploadCard
              label="Company Logo"
              imageUri={formData.companyLogo}
              onPress={() => handleImagePicker('companyLogo')}
              onRemovePress={() => handleRemoveImage('companyLogo')}
              height={120}
            />
          </AnimatedFormItem>

          {/* Template selection moved to TemplatePreview after Save & Submit */}

          <AnimatedPressable
            style={layoutStyles.saveButton}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-done" size={18} color="#0F0F0F" />
            <Text style={layoutStyles.saveButtonText}>
              Save & Submit
            </Text>
          </AnimatedPressable>

          {/* Go Back Button */}
          <AnimatedPressable
            style={[layoutStyles.saveButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D4AF37', marginTop: 12 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[layoutStyles.saveButtonText, { color: '#D4AF37' }]}>← Go Back</Text>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // ================= INPUT COMPONENT =================

  function InputField({
    label,
    placeholder,
    icon,
    value,
    onChangeText,
    keyboardType,
    maxLength,
    error,
  }) {
    const [isFocused, setIsFocused] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const iconScaleAnim = useRef(new Animated.Value(1)).current;

    const onFocusField = () => {
      setIsFocused(true);
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1.02, duration: 150, useNativeDriver: true }),
        Animated.timing(iconScaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      ]).start();
    };

    const onBlurField = () => {
      setIsFocused(false);
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(iconScaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    };

    return (
      <View style={formStyles.inputWrapper}>
        <Text style={formStyles.label}>{label}</Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={[
            formStyles.inputContainer,
            value?.trim?.() ? formStyles.inputContainerFilled : null,
            isFocused && formStyles.inputFocused,
            error && { borderColor: '#EF4444', borderWidth: 1.5 }
          ]}>
            <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
              <Ionicons
                name={icon}
                size={20}
                color={error ? '#EF4444' : isFocused ? '#D4AF37' : '#9CA3AF'}
                style={formStyles.inputIcon}
              />
            </Animated.View>

            <TextInput
              style={formStyles.input}
              placeholder={placeholder}
              keyboardType={keyboardType || 'default'}
              maxLength={maxLength}
              value={value}
              onChangeText={onChangeText}
              onFocus={onFocusField}
              onBlur={onBlurField}
            />
          </View>
        </Animated.View>

        {error && (
          <Text style={{ color: '#EF4444', fontSize: 12 }}>
            {error}
          </Text>
        )}
      </View>
    );
  }
}

