import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
// import Footer from '../../components/common/Footer';
import { businessDetailsStyles } from '../../styles/screens/businessDetailsStyles';
import { layoutStyles } from '../../styles/screens/personalDetailsLayoutStyles';
// import { getUser } from '../../utils/storage';
import AppHeader from '../../components/common/AppHeader';

import { getUser, updateBusinessDetails } from '../../database/userQueries';

export default function BusinessDetailsScreen({ route, navigation }) {
  const { personalData = {} } = route.params || {};
  const [userInitial, setUserInitial] = useState('N');

  // useEffect(() => {
  //   let mounted = true;
  //   const loadUser = async () => {
  //     try {
  //       const user = await getUser();
  //       if (mounted && user) {
  //         const name = user.first || user.fullName || user.firstName || '';
  //         const initial = name && name.trim().length ? name.trim().charAt(0).toUpperCase() : 'N';
  //         setUserInitial(initial);
  //       }
  //     } catch (e) {
  //       // ignore
  //     }
  //   };
  //   loadUser();
  //   return () => {
  //     mounted = false;
  //   };
  // }, []);
  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      try {
        const user = await getUser();
        if (mounted && user) {
          const name = user.name || '';
          const initial =
            name.trim().length > 0
              ? name.trim().charAt(0).toUpperCase()
              : 'N';
          setUserInitial(initial);
        }
      } catch (e) {
        // ignore
      }
    };
    loadUser();
    return () => {
      mounted = false;
    };
  }, []);


  const [form, setForm] = useState({
    searchKeywords: '',
    companyName: '',
    businessCategory: '',
    businessSubCategory: '',
    clients: '',
    businessDescription: '',
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [errors, setErrors] = useState({});

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.searchKeywords.trim()) {
      newErrors.searchKeywords = 'Search keywords are required';
    }
    if (!form.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!form.businessDescription.trim()) {
      newErrors.businessDescription = 'Business description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePdfPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled) {
        setPdfFile({
          name: result.assets[0].name,
          uri: result.assets[0].uri,
          size: result.assets[0].size,
        });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick PDF file');
    }
  };

  const handleLogoUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setLogoImage({
          name: result.assets[0].fileName || 'logo.jpg',
          uri: result.assets[0].uri,
          type: result.assets[0].type,
          width: result.assets[0].width,
          height: result.assets[0].height,
        });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // const handleNext = () => {
  //   if (!validateForm()) {
  //     Alert.alert('Validation Error', 'Please fill all required fields');
  //     return;
  //   }

  //   const businessData = {
  //     keywords: form.searchKeywords,
  //     company: form.companyName,
  //     category: form.businessCategory,
  //     subCategory: form.businessSubCategory,
  //     clients: form.clients,
  //     description: form.businessDescription,
  //     descriptionPdf: pdfFile,
  //     logoImage: logoImage,
  //   };

  //   const cardData = {
  //     ...personalData,
  //     ...businessData,
  //   };

  //   navigation.navigate('SocialMedia', { cardData });
  // };

  const handleNext = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    const businessData = {
      searchKeywords: form.searchKeywords,
      companyName: form.companyName,
      businessCategory: form.businessCategory,
      businessSubCategory: form.businessSubCategory,
      clients: form.clients,
      businessDescription: form.businessDescription,
      descriptionPdf: pdfFile,
      logoImage: logoImage,
    };

    try {
      // 🔥 SAVE BUSINESS DATA IN SQLITE
      updateBusinessDetails(businessData);

      // 🔥 PRINT FULL STORED USER IN TERMINAL
      const storedUser = getUser();
      console.log("📦 FULL USER AFTER BUSINESS SAVE:");
      console.log(JSON.stringify(storedUser, null, 2));

      navigation.navigate('SocialMedia');

    } catch (error) {
      console.log("SQLite Error:", error);
      Alert.alert("Error", "Failed to save business details");
    }
  };
  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToLanding = () => {
    navigation.navigate('Landing');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={businessDetailsStyles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppHeader />
      <KeyboardAvoidingView
        style={businessDetailsStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={businessDetailsStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
            </View>

            {/* Business Details Section */}
            <View style={layoutStyles.detailsSection}>
              {/* SEARCH KEYWORDS */}
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Ionicons
                      name="search"
                      size={17}
                      color="#D4AF37"
                    />
                    <Text style={businessDetailsStyles.label}>
                      {'  '}Search Keywords
                      <Text style={businessDetailsStyles.star}> *</Text>
                    </Text>
                  </View>
                  {errors.searchKeywords && (
                    <Text style={businessDetailsStyles.errorText}>
                      {errors.searchKeywords}
                    </Text>
                  )}
                </View>
                <TextInput
                  style={[
                    businessDetailsStyles.input,
                    errors.searchKeywords && businessDetailsStyles.inputError,
                  ]}
                  placeholder="e.g., Web Design, Digital Marketing"
                  placeholderTextColor="#9CA3AF"
                  value={form.searchKeywords}
                  onChangeText={(value) =>
                    updateForm('searchKeywords', value)
                  }
                />
              </View>

              {/* COMPANY NAME */}
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Ionicons
                      name="briefcase"
                      size={17}
                      color="#D4AF37"
                    />
                    <Text style={businessDetailsStyles.label}>
                      {'  '}Company Name
                      <Text style={businessDetailsStyles.star}> *</Text>
                    </Text>
                  </View>
                  {errors.companyName && (
                    <Text style={businessDetailsStyles.errorText}>
                      {errors.companyName}
                    </Text>
                  )}
                </View>
                <TextInput
                  style={[
                    businessDetailsStyles.input,
                    errors.companyName && businessDetailsStyles.inputError,
                  ]}
                  placeholder="Enter your company name"
                  placeholderTextColor="#9CA3AF"
                  value={form.companyName}
                  onChangeText={(value) => updateForm('companyName', value)}
                />
              </View>

              {/* BUSINESS CATEGORY */}
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Ionicons
                      name="pricetag"
                      size={17}
                      color="#D4AF37"
                    />
                    <Text style={businessDetailsStyles.label}>
                      {'  '}Business Category
                    </Text>
                  </View>
                </View>
                <TextInput
                  style={businessDetailsStyles.input}
                  placeholder="e.g., Technology, Finance"
                  placeholderTextColor="#9CA3AF"
                  value={form.businessCategory}
                  onChangeText={(value) =>
                    updateForm('businessCategory', value)
                  }
                />
              </View>

              {/* BUSINESS SUB-CATEGORY */}
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Ionicons
                      name="layers"
                      size={17}
                      color="#D4AF37"
                    />
                    <Text style={businessDetailsStyles.label}>
                      {'  '}Business Sub-Category
                    </Text>
                  </View>
                </View>
                <TextInput
                  style={businessDetailsStyles.input}
                  placeholder="e.g., Web Development, Consulting"
                  placeholderTextColor="#9CA3AF"
                  value={form.businessSubCategory}
                  onChangeText={(value) =>
                    updateForm('businessSubCategory', value)
                  }
                />
              </View>

              {/* CLIENTS */}
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Ionicons
                      name="people"
                      size={17}
                      color="#D4AF37"
                    />
                    <Text style={businessDetailsStyles.label}>
                      {'  '}Clients
                    </Text>
                  </View>
                </View>
                <TextInput
                  style={businessDetailsStyles.input}
                  placeholder="List your main clients (optional)"
                  placeholderTextColor="#9CA3AF"
                  value={form.clients}
                  onChangeText={(value) => updateForm('clients', value)}
                />
              </View>

              {/* BUSINESS DESCRIPTION */}
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Ionicons
                      name="document-text"
                      size={17}
                      color="#D4AF37"
                    />
                    <Text style={businessDetailsStyles.label}>
                      {'  '}Business Description
                      <Text style={businessDetailsStyles.star}> *</Text>
                    </Text>
                  </View>
                  {errors.businessDescription && (
                    <Text style={businessDetailsStyles.errorText}>
                      {errors.businessDescription}
                    </Text>
                  )}
                </View>
                <TextInput
                  style={[
                    businessDetailsStyles.input,
                    businessDetailsStyles.multilineInput,
                    errors.businessDescription &&
                    businessDetailsStyles.inputError,
                  ]}
                  placeholder="Describe your business, services, and expertise"
                  placeholderTextColor="#9CA3AF"
                  value={form.businessDescription}
                  onChangeText={(value) =>
                    updateForm('businessDescription', value)
                  }
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>

              {/* PDF UPLOAD */}
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Ionicons
                      name="document"
                      size={17}
                      color="#D4AF37"
                    />
                    <Text style={businessDetailsStyles.label}>
                      {'  '}Business Description PDF
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={businessDetailsStyles.pdfButton}
                  onPress={handlePdfPicker}
                >
                  <Ionicons
                    name="cloud-upload"
                    size={20}
                    color="#D4AF37"
                  />
                  <Text style={businessDetailsStyles.pdfButtonText}>
                    Choose PDF File
                  </Text>
                </TouchableOpacity>
                {pdfFile && (
                  <View style={businessDetailsStyles.pdfFileInfo}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#22c55e"
                    />
                    <Text style={businessDetailsStyles.pdfFileName}>
                      {pdfFile.name}
                    </Text>
                  </View>
                )}
              </View>

            </View>

            {/* BUTTON GROUP */}
            <View style={layoutStyles.buttonGroup}>
              <TouchableOpacity
                style={layoutStyles.saveButton}
                onPress={handleNext}
              >
                <Ionicons name="checkmark-done" size={18} color="#0F0F0F" />
                <Text style={layoutStyles.saveButtonText}>Step 3: Social Media</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={layoutStyles.skipButton}
                onPress={handleBack}
              >
                <Ionicons name="arrow-back" size={18} color="#D4AF37" />
                <Text style={layoutStyles.skipButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* <Footer activeTab="" navigation={navigation} fromScreen="BusinessDetails" /> */}
    </SafeAreaView>
  );
}
