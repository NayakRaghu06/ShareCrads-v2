// //         error && { borderColor: '#EF4444', borderWidth: 2 }
// //       ]}>
// //         <Ionicons 
// //           name={icon} 
// //           size={20} 
// //           color={error ? '#EF4444' : '#D4AF37'} 
// //           style={formStyles.inputIcon} 
// //         />
// //         <TextInput
// //           style={[
// //             formStyles.input,
// //             error && { color: '#EF4444' }
// //           ]}
// //           placeholder={placeholder}
// //           placeholderTextColor={error ? '#FCA5A5' : '#A0AEC0'}
// //           keyboardType={keyboardType || 'url'}
// //           maxLength={maxLength}
// //           value={value}
// //           onChangeText={onChangeText}
// //         />
// //       </View>
// //       {error && (
// //         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
// //           <Ionicons name="alert-circle" size={14} color="#EF4444" />
// //           <Text style={{ color: '#EF4444', fontSize: 12, marginLeft: 4, fontWeight: '500' }}>
// //             {error}
// //           </Text>
// //         </View>
// //       )}
// //     </View>
// //   );
// // }

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

//   const handleImagePicker = async (field) => {
//     try {
//       const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (!permission.granted) {
//         Alert.alert(
//           "Permission Required",
//           "Please allow gallery access to upload images."
//         );
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.7,
//       });

//       if (!result.canceled) {
//         const selectedImage = result.assets[0].uri;

//         setFormData((prev) => ({
//           ...prev,
//           [field]: selectedImage,
//         }));
//       }
//     } catch (error) {
//       console.log("Image Picker Error:", error);
//       Alert.alert("Error", "Something went wrong while selecting image");
//     }
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
//           onPress={() => navigation.goBack()}
//           style={{ width: 24, justifyContent: 'center', alignItems: 'center', zIndex: 2 }}
//         >
//           <Ionicons name="chevron-back" size={28} color="#D4AF37" />
//         </TouchableOpacity>

//         {/* App Title Centered */}
//         <View style={{
//           position: 'absolute',
//           left: 0,
//           right: 0,
//           top: 0,
//           bottom: 0,
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1
//         }}>
//           <Text style={layoutStyles.appTitle}>
//             DIGITAL BUSINESS CARD
//           </Text>
//         </View>
//       </View>
//       <View style={{ height: 4, backgroundColor: '#D4AF37', marginBottom: 10 }} />

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
//             All fields marked with * are mandatory
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
//             onChangeText={(text) => handleFieldChange('whatsapp', text.replace(/[^0-9]/g, '').slice(0, 10))}
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
import * as ImagePicker from 'expo-image-picker';

import { layoutStyles } from '../../styles/screens/socialMediaStyles';
import { formStyles } from '../../styles/screens/socialMediaStyles';
import Footer from '../../components/common/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  website: {
    urlFormat: true,
    required: false,
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
        quality: 0.7,
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

    if (name === 'website') {
      if (!/^https?:\/\/.+\..+/.test(value)) {
        return 'Enter valid website URL';
      }
    }

    return '';
  };

  const handleFieldChange = (name, value) => {
    let cleanedValue = value;

    if (name === 'whatsapp') {
      cleanedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'instagram') {
      cleanedValue = value.replace(/\s/g, '');
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
        // QR image key used in templates
        qrCodeImage: formData.qrCode || cardData.qrCodeImage || cardData.qrCode || null,
        // company logo
        companyLogo: formData.companyLogo || cardData.companyLogo || cardData.logoImage || null,
        // scanned visiting card
        businessCard: formData.businessCard || cardData.businessCard || null,
      };

      const socialFields = {
        whatsapp: formData.whatsapp || cardData.whatsapp || cardData.whatsappNumber || null,
        linkedin: formData.linkedin || cardData.linkedin || null,
        instagram: formData.instagram || cardData.instagram || null,
        twitter: formData.twitter || cardData.twitter || null,
        facebook: formData.facebook || cardData.facebook || null,
        youtube: formData.youtube || cardData.youtube || null,
        website: formData.website || cardData.website || null,
      };

      const finalCardData = {
        ...cardData,
        ...uploadMap,
        ...socialFields,
      };

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
        qrCode: cardData.qrCodeImage || cardData.qrCode || prev.qrCode,
        businessCard: cardData.businessCard || prev.businessCard,
        whatsapp: cardData.whatsapp || prev.whatsapp,
        linkedin: cardData.linkedin || prev.linkedin,
        instagram: cardData.instagram || prev.instagram,
        twitter: cardData.twitter || prev.twitter,
        facebook: cardData.facebook || prev.facebook,
        youtube: cardData.youtube || prev.youtube,
        website: cardData.website || prev.website,
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
        const phone = await AsyncStorage.getItem('userPhone');
        if (phone) {
          setFormData((prev) => ({ ...prev, whatsapp: phone }));
        }
      } catch (e) {
        // ignore
      }
    };
    loadPhone();
  }, []);

  const navigateToBusinessDetails = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={layoutStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10, backgroundColor: '#fff' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4, marginRight: 8 }}>
          <Ionicons name="chevron-back" size={26} color="#D4AF37" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', flex: 1 }}>Social Media & Uploads</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={layoutStyles.titleSection}>
          <Text style={layoutStyles.subtitle}>
            Add your social links and upload media
          </Text>
        </View>

        <View style={layoutStyles.formCard}>
          <Text style={layoutStyles.sectionTitle}>
            Social Media & Contact Links
          </Text>

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

          <InputField
            label="LinkedIn (Optional)"
            placeholder="https://linkedin.com/in/yourprofile"
            icon="logo-linkedin"
            value={formData.linkedin}
            onChangeText={(text) => handleFieldChange('linkedin', text)}
            error={errors.linkedin}
          />

          <InputField
            label="Instagram (Optional)"
            placeholder="yourusername"
            icon="logo-instagram"
            value={formData.instagram}
            onChangeText={(text) => handleFieldChange('instagram', text)}
            error={errors.instagram}
          />

          <InputField
            label="Website (Optional)"
            placeholder="https://example.com"
            icon="globe"
            value={formData.website}
            onChangeText={(text) => handleFieldChange('website', text)}
            error={errors.website}
          />

          {/* ================= UPLOAD SECTION ================= */}

          <Text style={layoutStyles.sectionTitle}>Media Uploads</Text>

          {['companyLogo', 'profilePhoto', 'qrCode', 'businessCard'].map((field) => (
            <TouchableOpacity
              key={field}
              style={layoutStyles.uploadBox}
              onPress={() => handleImagePicker(field)}
            >
              <View style={layoutStyles.uploadContent}>
                <Ionicons name="image" size={32} color="#D4AF37" />
                <Text style={layoutStyles.uploadLabel}>
                  {field}
                </Text>
              </View>

              {formData[field] && (
                field === 'companyLogo' ? (
                  <View style={layoutStyles.uploadedImageLogo}>
                    <Image
                      source={{ uri: formData[field] }}
                      style={layoutStyles.uploadedImageLogoPreview}
                    />
                  </View>
                ) : (
                  <View style={layoutStyles.uploadedImage}>
                    <Image
                      source={{ uri: formData[field] }}
                      style={layoutStyles.uploadedImagePreview}
                    />
                  </View>
                )
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={layoutStyles.saveButton}
            onPress={handleSave}
          >
            <Text style={layoutStyles.saveButtonText}>
              Save & Submit
            </Text>
          </TouchableOpacity>

          {/* Go Back Button */}
          <TouchableOpacity
            style={[layoutStyles.saveButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D4AF37', marginTop: 12 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[layoutStyles.saveButtonText, { color: '#D4AF37' }]}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  return (
    <View style={formStyles.inputWrapper}>
      <Text style={formStyles.label}>{label}</Text>

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
          style={formStyles.input}
          placeholder={placeholder}
          keyboardType={keyboardType || 'default'}
          maxLength={maxLength}
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      {error && (
        <Text style={{ color: '#EF4444', fontSize: 12 }}>
          {error}
        </Text>
      )}
    </View>
  );
}