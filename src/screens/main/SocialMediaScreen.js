// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   StatusBar,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';

// import { layoutStyles } from '../../styles/screens/socialMediaStyles';
// import { formStyles } from '../../styles/screens/socialMediaStyles';
// import Footer from '../../components/common/Footer';

// // Validation rules for Social Media
// const validations = {
//   whatsapp: {
//     exactLength: 10,
//     numbersOnly: true,
//     required: false,
//     message: 'WhatsApp must be 10 digits',
//   },
//   instagram: {
//     noSpaces: true,
//     required: false,
//     message: 'Instagram username cannot contain spaces',
//   },
//   linkedin: {
//     urlFormat: true,
//     required: false,
//     message: 'Enter valid LinkedIn URL',
//   },
//   website: {
//     urlFormat: true,
//     required: false,
//     message: 'Enter valid website URL',
//   },
// };

// export default function SocialMediaScreen({ route, navigation }) {
//   const { cardData = {} } = route.params || {};
//   const [formData, setFormData] = useState({
//     whatsapp: '',
//     linkedin: '',
//     instagram: '',
//     twitter: '',
//     facebook: '',
//     youtube: '',
//     website: '',
//     companyLogo: null,
//     profilePhoto: null,
//     qrCode: null,
//     businessCard: null,
//   });

//   const [errors, setErrors] = useState({});

//   // Validate single field
//   const validateField = (name, value) => {
//     const rule = validations[name];
//     if (!rule) return '';

//     if (!rule.required && !value.trim()) {
//       return '';
//     }

//     if (name === 'whatsapp' && value) {
//       const digits = value.replace(/\D/g, '');
//       if (digits.length !== rule.exactLength) {
//         return `WhatsApp must be exactly ${rule.exactLength} digits`;
//       }
//       if (!/^[0-9]*$/.test(digits)) {
//         return 'WhatsApp must contain numbers only';
//       }
//     }

//     if (name === 'instagram' && value) {
//       if (/\s/.test(value)) {
//         return 'Instagram username cannot contain spaces';
//       }
//     }

//     if (name === 'linkedin' && value) {
//       if (!/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(value)) {
//         return 'Enter valid LinkedIn URL (https://linkedin.com/...)';
//       }
//     }

//     if (name === 'website' && value) {
//       if (!/^https?:\/\/.+\..+/.test(value)) {
//         return 'Enter valid website URL (must start with http:// or https://)';
//       }
//     }

//     return '';
//   };

//   // Handle field change
//   const handleFieldChange = (name, value) => {
//     let cleanedValue = value;

//     // Clean based on field type
//     if (name === 'whatsapp') {
//       cleanedValue = value.replace(/\D/g, '').slice(0, 10);
//     } else if (name === 'instagram') {
//       cleanedValue = value.replace(/\s/g, '').slice(0, 30);
//     }

//     setFormData({ ...formData, [name]: cleanedValue });

//     // Real-time validation
//     const error = validateField(name, cleanedValue);
//     setErrors({ ...errors, [name]: error });
//   };

//   // Validate all fields before saving
//   const validateAllFields = () => {
//     const newErrors = {};
//     let isValid = true;

//     Object.keys(validations).forEach((field) => {
//       const error = validateField(field, formData[field]);
//       if (error) {
//         newErrors[field] = error;
//         isValid = false;
//       }
//     });

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSave = () => {
//     if (validateAllFields()) {
//       const socialData = {
//         linkedin: formData.linkedin,
//         instagram: formData.instagram,
//         twitter: formData.twitter,
//         website: formData.website,
//       };
//       const finalCardData = {
//         ...cardData,
//         ...socialData,
//       };
//       navigation.navigate('TemplatePreview', { cardData: finalCardData });
//     } else {
//       Alert.alert('Validation Error', 'Please fix all errors');
//     }
//   };

//   const navigateToBusinessDetails = () => {
//     navigation.goBack();
//   };

//   const handleImagePicker = (field) => {
//     // Placeholder for image picker functionality
//     console.log(`Image picker for ${field}`);
//   };

//   return (
//     <SafeAreaView style={layoutStyles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 30 }}
//       >
      
//       {/* ========== HEADER SECTION ========== */}
//       <View style={layoutStyles.headerSection}>
//         {/* Back Button */}
//         <TouchableOpacity 
//           style={layoutStyles.backButton}
//           onPress={navigateToBusinessDetails}
//         >
//           <Ionicons name="chevron-back" size={28} color="#D4AF37" />
//         </TouchableOpacity>

//         {/* App Title */}
//         <Text style={layoutStyles.appTitle}>
//           SOCIAL MEDIA
//         </Text>

//         {/* Step Indicator */}
//         <View style={layoutStyles.stepIndicator}>
//           <Text style={layoutStyles.stepText}>3</Text>
//         </View>
//       </View>

//       {/* ========== TITLE SECTION ========== */}
//       <View style={layoutStyles.titleSection}>
//         <Text style={layoutStyles.mainTitle}>
//           Social Media & Uploads
//         </Text>
//         <Text style={layoutStyles.subtitle}>
//           Add your social links and upload media to complete your card
//         </Text>
//       </View>

//       {/* ========== FORM CARD SECTION ========== */}
//       <View style={layoutStyles.formCard}>
        
//         {/* Card Header */}
//         <View style={layoutStyles.cardHeader}>
//           <Text style={layoutStyles.cardTitle}>Step 3 of 3</Text>
//           <Text style={layoutStyles.cardSubtitle}>
//             Complete your digital business card
//           </Text>
//         </View>

//         {/* Section 1: Social Links */}
//         <View style={layoutStyles.detailsSection}>
//           <Text style={layoutStyles.sectionTitle}>Social Media & Contact Links</Text>

//           <InputField 
//             label="WhatsApp (Optional, 10 digits)" 
//             placeholder="Mobile number"
//             icon="logo-whatsapp"
//             keyboardType="phone-pad"
//             value={formData.whatsapp}
//             onChangeText={(text) => handleFieldChange('whatsapp', text)}
//             error={errors.whatsapp}
//             maxLength={10}
//           />

//           <InputField 
//             label="LinkedIn (Optional)" 
//             placeholder="https://linkedin.com/in/yourprofile"
//             icon="logo-linkedin"
//             value={formData.linkedin}
//             onChangeText={(text) => handleFieldChange('linkedin', text)}
//             error={errors.linkedin}
//           />

//           <InputField 
//             label="Instagram (Optional, username no spaces)" 
//             placeholder="yourusername"
//             icon="logo-instagram"
//             value={formData.instagram}
//             onChangeText={(text) => handleFieldChange('instagram', text)}
//             error={errors.instagram}
//           />

//           <InputField 
//             label="Twitter (Optional)" 
//             placeholder="https://twitter.com/yourprofile"
//             icon="logo-twitter"
//             value={formData.twitter}
//             onChangeText={(text) => setFormData({...formData, twitter: text})}
//           />

//           <InputField 
//             label="Facebook (Optional)" 
//             placeholder="https://facebook.com/yourprofile"
//             icon="logo-facebook"
//             value={formData.facebook}
//             onChangeText={(text) => setFormData({...formData, facebook: text})}
//           />

//           <InputField 
//             label="YouTube (Optional)" 
//             placeholder="https://youtube.com/c/yourprofile"
//             icon="logo-youtube"
//             value={formData.youtube}
//             onChangeText={(text) => setFormData({...formData, youtube: text})}
//           />

//           <InputField 
//             label="Website (Optional)" 
//             placeholder="https://example.com"
//             icon="globe"
//             value={formData.website}
//             onChangeText={(text) => handleFieldChange('website', text)}
//             error={errors.website}
//           />
//         </View>

//         {/* Section 2: Media Uploads */}
//         <View style={layoutStyles.detailsSection}>
//           <Text style={layoutStyles.sectionTitle}>Media Uploads</Text>

//           {/* Company Logo Upload */}
//           <TouchableOpacity 
//             style={layoutStyles.uploadBox}
//             onPress={() => handleImagePicker('companyLogo')}
//           >
//             <View style={layoutStyles.uploadContent}>
//               <Ionicons name="image" size={32} color="#D4AF37" />
//               <Text style={layoutStyles.uploadLabel}>Company Logo</Text>
//               <Text style={layoutStyles.uploadHint}>Tap to upload (Max 5MB)</Text>
//             </View>
//             {formData.companyLogo && (
//               <View style={layoutStyles.uploadedImage}>
//                 <Image 
//                   source={{ uri: formData.companyLogo }} 
//                   style={layoutStyles.uploadedImagePreview}
//                 />
//               </View>
//             )}
//           </TouchableOpacity>

//           {/* Profile Photo Upload */}
//           <TouchableOpacity 
//             style={layoutStyles.uploadBox}
//             onPress={() => handleImagePicker('profilePhoto')}
//           >
//             <View style={layoutStyles.uploadContent}>
//               <Ionicons name="person-circle" size={32} color="#D4AF37" />
//               <Text style={layoutStyles.uploadLabel}>Profile Photo</Text>
//               <Text style={layoutStyles.uploadHint}>Tap to upload (Max 5MB)</Text>
//             </View>
//             {formData.profilePhoto && (
//               <View style={layoutStyles.uploadedImage}>
//                 <Image 
//                   source={{ uri: formData.profilePhoto }} 
//                   style={layoutStyles.uploadedImagePreview}
//                 />
//               </View>
//             )}
//           </TouchableOpacity>

//           {/* QR Code Upload */}
//           <TouchableOpacity 
//             style={layoutStyles.uploadBox}
//             onPress={() => handleImagePicker('qrCode')}
//           >
//             <View style={layoutStyles.uploadContent}>
//               <Ionicons name="qr-code" size={32} color="#D4AF37" />
//               <Text style={layoutStyles.uploadLabel}>QR Code</Text>
//               <Text style={layoutStyles.uploadHint}>Tap to upload (Max 5MB)</Text>
//             </View>
//             {formData.qrCode && (
//               <View style={layoutStyles.uploadedImage}>
//                 <Image 
//                   source={{ uri: formData.qrCode }} 
//                   style={layoutStyles.uploadedImagePreview}
//                 />
//               </View>
//             )}
//           </TouchableOpacity>

//           {/* Existing Visiting Card Upload */}
//           <TouchableOpacity 
//             style={layoutStyles.uploadBox}
//             onPress={() => handleImagePicker('businessCard')}
//           >
//             <View style={layoutStyles.uploadContent}>
//               <Ionicons name="card" size={32} color="#D4AF37" />
//               <Text style={layoutStyles.uploadLabel}>Existing Visiting Card</Text>
//               <Text style={layoutStyles.uploadHint}>Tap to upload (Max 5MB)</Text>
//             </View>
//             {formData.businessCard && (
//               <View style={layoutStyles.uploadedImage}>
//                 <Image 
//                   source={{ uri: formData.businessCard }} 
//                   style={layoutStyles.uploadedImagePreview}
//                 />
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Action Buttons */}
//         <View style={layoutStyles.buttonGroup}>
//           <TouchableOpacity 
//             style={layoutStyles.saveButton}
//             onPress={handleSave}
//           >
//             <Ionicons name="checkmark-done" size={18} color="#0F0F0F" />
//             <Text style={layoutStyles.saveButtonText}>Save & Submit</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={layoutStyles.skipButton}
//             onPress={navigateToBusinessDetails}
//           >
//             <Ionicons name="arrow-back" size={18} color="#D4AF37" />
//             <Text style={layoutStyles.skipButtonText}>Go Back</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={{ height: 30 }} />
//       </ScrollView>
//       {/* <Footer activeTab="" navigation={navigation} fromScreen="SocialMedia" /> */}
//     </SafeAreaView>
//   );
// }

// function InputField({ label, placeholder, icon, value, onChangeText, keyboardType, maxLength, error }) {
//   return (
//     <View style={formStyles.inputWrapper}>
//       <Text style={formStyles.label}>
//         {label}
//       </Text>
//       <View style={[
//         formStyles.inputContainer,
//         error && { borderColor: '#EF4444', borderWidth: 2 }
//       ]}>
//         <Ionicons 
//           name={icon} 
//           size={20} 
//           color={error ? '#EF4444' : '#D4AF37'} 
//           style={formStyles.inputIcon} 
//         />
//         <TextInput
//           style={[
//             formStyles.input,
//             error && { color: '#EF4444' }
//           ]}
//           placeholder={placeholder}
//           placeholderTextColor={error ? '#FCA5A5' : '#A0AEC0'}
//           keyboardType={keyboardType || 'url'}
//           maxLength={maxLength}
//           value={value}
//           onChangeText={onChangeText}
//         />
//       </View>
//       {error && (
//         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
//           <Ionicons name="alert-circle" size={14} color="#EF4444" />
//           <Text style={{ color: '#EF4444', fontSize: 12, marginLeft: 4, fontWeight: '500' }}>
//             {error}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// }

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { layoutStyles } from '../../styles/screens/socialMediaStyles';
import { formStyles } from '../../styles/screens/socialMediaStyles';
import Footer from '../../components/common/Footer';

// Validation rules for Social Media
const validations = {
  whatsapp: {
    exactLength: 10,
    numbersOnly: true,
    required: false,
    message: 'WhatsApp must be 10 digits',
  },
  instagram: {
    noSpaces: true,
    required: false,
    message: 'Instagram username cannot contain spaces',
  },
  linkedin: {
    urlFormat: true,
    required: false,
    message: 'Enter valid LinkedIn URL',
  },
  website: {
    urlFormat: true,
    required: false,
    message: 'Enter valid website URL',
  },
};

export default function SocialMediaScreen({ route, navigation }) {
  const { cardData = {} } = route.params || {};
  const [formData, setFormData] = useState({
    whatsapp: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    facebook: '',
    youtube: '',
    website: '',
    companyLogo: null,
    profilePhoto: null,
    qrCode: null,
    businessCard: null,
  });

  const [errors, setErrors] = useState({});

  // Validate single field
  const validateField = (name, value) => {
    const rule = validations[name];
    if (!rule) return '';

    if (!rule.required && !value.trim()) {
      return '';
    }

    if (name === 'whatsapp' && value) {
      const digits = value.replace(/\D/g, '');
      if (digits.length !== rule.exactLength) {
        return `WhatsApp must be exactly ${rule.exactLength} digits`;
      }
      if (!/^[0-9]*$/.test(digits)) {
        return 'WhatsApp must contain numbers only';
      }
    }

    if (name === 'instagram' && value) {
      if (/\s/.test(value)) {
        return 'Instagram username cannot contain spaces';
      }
    }

    if (name === 'linkedin' && value) {
      if (!/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(value)) {
        return 'Enter valid LinkedIn URL (https://linkedin.com/...)';
      }
    }

    if (name === 'website' && value) {
      if (!/^https?:\/\/.+\..+/.test(value)) {
        return 'Enter valid website URL (must start with http:// or https://)';
      }
    }

    return '';
  };

  // Handle field change
  const handleFieldChange = (name, value) => {
    let cleanedValue = value;

    // Clean based on field type
    if (name === 'whatsapp') {
      cleanedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'instagram') {
      cleanedValue = value.replace(/\s/g, '').slice(0, 30);
    }

    setFormData({ ...formData, [name]: cleanedValue });

    // Real-time validation
    const error = validateField(name, cleanedValue);
    setErrors({ ...errors, [name]: error });
  };

  // Validate all fields before saving
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
      const socialData = {
        linkedin: formData.linkedin,
        instagram: formData.instagram,
        twitter: formData.twitter,
        website: formData.website,
      };
      const finalCardData = {
        ...cardData,
        ...socialData,
      };
      navigation.navigate('TemplatePreview', { cardData: finalCardData });
    } else {
      Alert.alert('Validation Error', 'Please fix all errors');
    }
  };

  const navigateToBusinessDetails = () => {
    navigation.goBack();
  };

  const handleImagePicker = (field) => {
    // Placeholder for image picker functionality
    console.log(`Image picker for ${field}`);
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
          style={layoutStyles.backButton}
          onPress={navigateToBusinessDetails}
        >
          <Ionicons name="chevron-back" size={28} color="#D4AF37" />
        </TouchableOpacity>

        {/* App Title */}
        <Text style={layoutStyles.appTitle}>
          SOCIAL MEDIA
        </Text>

        {/* Step Indicator */}
        <View style={layoutStyles.stepIndicator}>
          <Text style={layoutStyles.stepText}>3</Text>
        </View>
      </View>

      {/* ========== TITLE SECTION ========== */}
      <View style={layoutStyles.titleSection}>
        <Text style={layoutStyles.mainTitle}>
          Social Media & Uploads
        </Text>
        <Text style={layoutStyles.subtitle}>
          Add your social links and upload media to complete your card
        </Text>
      </View>

      {/* ========== FORM CARD SECTION ========== */}
      <View style={layoutStyles.formCard}>
        
        {/* Card Header */}
        <View style={layoutStyles.cardHeader}>
          <Text style={layoutStyles.cardTitle}>Step 3 of 3</Text>
          <Text style={layoutStyles.cardSubtitle}>
            Complete your digital business card
          </Text>
        </View>

        {/* Section 1: Social Links */}
        <View style={layoutStyles.detailsSection}>
          <Text style={layoutStyles.sectionTitle}>Social Media & Contact Links</Text>

          <InputField 
            label="WhatsApp (Optional, 10 digits)" 
            placeholder="Mobile number"
            icon="logo-whatsapp"
            keyboardType="phone-pad"
            value={formData.whatsapp}
            onChangeText={(text) => handleFieldChange('whatsapp', text)}
            error={errors.whatsapp}
            maxLength={10}
          />

          <InputField 
            label="LinkedIn (Optional)" 
            placeholder="https://linkedin.com/in/yourprofile"
            icon="logo-linkedin"
            value={formData.linkedin}
            onChangeText={(text) => handleFieldChange('linkedin', text)}
            error={errors.linkedin}
          />

          <InputField 
            label="Instagram (Optional, username no spaces)" 
            placeholder="yourusername"
            icon="logo-instagram"
            value={formData.instagram}
            onChangeText={(text) => handleFieldChange('instagram', text)}
            error={errors.instagram}
          />

          <InputField 
            label="Twitter (Optional)" 
            placeholder="https://twitter.com/yourprofile"
            icon="logo-twitter"
            value={formData.twitter}
            onChangeText={(text) => setFormData({...formData, twitter: text})}
          />

          <InputField 
            label="Facebook (Optional)" 
            placeholder="https://facebook.com/yourprofile"
            icon="logo-facebook"
            value={formData.facebook}
            onChangeText={(text) => setFormData({...formData, facebook: text})}
          />

          <InputField 
            label="YouTube (Optional)" 
            placeholder="https://youtube.com/c/yourprofile"
            icon="logo-youtube"
            value={formData.youtube}
            onChangeText={(text) => setFormData({...formData, youtube: text})}
          />

          <InputField 
            label="Website (Optional)" 
            placeholder="https://example.com"
            icon="globe"
            value={formData.website}
            onChangeText={(text) => handleFieldChange('website', text)}
            error={errors.website}
          />
        </View>

        {/* Section 2: Media Uploads */}
        <View style={layoutStyles.detailsSection}>
          <Text style={layoutStyles.sectionTitle}>Media Uploads</Text>

          {/* Company Logo Upload */}
          <TouchableOpacity 
            style={layoutStyles.uploadBox}
            onPress={() => handleImagePicker('companyLogo')}
          >
            <View style={layoutStyles.uploadContent}>
              <Ionicons name="image" size={32} color="#D4AF37" />
              <Text style={layoutStyles.uploadLabel}>Company Logo</Text>
              <Text style={layoutStyles.uploadHint}>Tap to upload (Max 5MB)</Text>
            </View>
            {formData.companyLogo && (
              <View style={layoutStyles.uploadedImage}>
                <Image 
                  source={{ uri: formData.companyLogo }} 
                  style={layoutStyles.uploadedImagePreview}
                />
              </View>
            )}
          </TouchableOpacity>

          {/* Profile Photo Upload */}
          <TouchableOpacity 
            style={layoutStyles.uploadBox}
            onPress={() => handleImagePicker('profilePhoto')}
          >
            <View style={layoutStyles.uploadContent}>
              <Ionicons name="person-circle" size={32} color="#D4AF37" />
              <Text style={layoutStyles.uploadLabel}>Profile Photo</Text>
              <Text style={layoutStyles.uploadHint}>Tap to upload (Max 5MB)</Text>
            </View>
            {formData.profilePhoto && (
              <View style={layoutStyles.uploadedImage}>
                <Image 
                  source={{ uri: formData.profilePhoto }} 
                  style={layoutStyles.uploadedImagePreview}
                />
              </View>
            )}
          </TouchableOpacity>

          {/* QR Code Upload */}
          <TouchableOpacity 
            style={layoutStyles.uploadBox}
            onPress={() => handleImagePicker('qrCode')}
          >
            <View style={layoutStyles.uploadContent}>
              <Ionicons name="qr-code" size={32} color="#D4AF37" />
              <Text style={layoutStyles.uploadLabel}>QR Code</Text>
              <Text style={layoutStyles.uploadHint}>Tap to upload (Max 5MB)</Text>
            </View>
            {formData.qrCode && (
              <View style={layoutStyles.uploadedImage}>
                <Image 
                  source={{ uri: formData.qrCode }} 
                  style={layoutStyles.uploadedImagePreview}
                />
              </View>
            )}
          </TouchableOpacity>

          {/* Existing Visiting Card Upload */}
          <TouchableOpacity 
            style={layoutStyles.uploadBox}
            onPress={() => handleImagePicker('businessCard')}
          >
            <View style={layoutStyles.uploadContent}>
              <Ionicons name="card" size={32} color="#D4AF37" />
              <Text style={layoutStyles.uploadLabel}>Existing Visiting Card</Text>
              <Text style={layoutStyles.uploadHint}>Tap to upload (Max 5MB)</Text>
            </View>
            {formData.businessCard && (
              <View style={layoutStyles.uploadedImage}>
                <Image 
                  source={{ uri: formData.businessCard }} 
                  style={layoutStyles.uploadedImagePreview}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={layoutStyles.buttonGroup}>
          <TouchableOpacity 
            style={layoutStyles.saveButton}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-done" size={18} color="#0F0F0F" />
            <Text style={layoutStyles.saveButtonText}>Save & Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={layoutStyles.skipButton}
            onPress={navigateToBusinessDetails}
          >
            <Ionicons name="arrow-back" size={18} color="#D4AF37" />
            <Text style={layoutStyles.skipButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 30 }} />
      </ScrollView>
      {/* <Footer activeTab="" navigation={navigation} fromScreen="SocialMedia" /> */}
    </SafeAreaView>
  );
}

function InputField({ label, placeholder, icon, value, onChangeText, keyboardType, maxLength, error }) {
  return (
    <View style={formStyles.inputWrapper}>
      <Text style={formStyles.label}>
        {label}
      </Text>
      <View style={[
        formStyles.inputContainer,
        error && { borderColor: '#EF4444', borderWidth: 2 }
      ]}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={error ? '#EF4444' : '#D4AF37'} 
          style={formStyles.inputIcon} 
        />
        <TextInput
          style={[
            formStyles.input,
            error && { color: '#EF4444' }
          ]}
          placeholder={placeholder}
          placeholderTextColor={error ? '#FCA5A5' : '#A0AEC0'}
          keyboardType={keyboardType || 'url'}
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
