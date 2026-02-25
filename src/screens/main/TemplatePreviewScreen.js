import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ModernTemplate from '../../components/templates/ModernTemplate';
import DarkTemplate from '../../components/templates/DarkTemplate';
import ClassicTemplate from '../../components/templates/ClassicTemplate';
import MinimalTemplate from '../../components/templates/MinimalTemplate';
import { layoutStyles } from '../../styles/screens/personalDetailsLayoutStyles';
import { getUser } from '../../utils/storage';
import styles from '../../styles/screens/templatePreviewStyles';

const TemplatePreviewScreen = ({ route, navigation }) => {
  const routeParams = route?.params || {};
  const { cardData = {} } = routeParams;
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userInitial, setUserInitial] = React.useState('N');

  React.useEffect(() => {
    // Log received cardData for debugging
    console.log('TemplatePreviewScreen received cardData:', JSON.stringify(cardData, null, 2));
  }, [cardData]);

  React.useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      try {
        const user = await getUser();
        if (mounted && user) {
          const name = user.first || user.fullName || user.firstName || '';
          const initial = name && name.trim().length ? name.trim().charAt(0).toUpperCase() : 'N';
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

  const templates = [
    { id: 'classic', name: 'Classic', component: ClassicTemplate },
    { id: 'modern', name: 'Modern', component: ModernTemplate },
    { id: 'minimal', name: 'Minimal', component: MinimalTemplate },
    { id: 'dark', name: 'Dark', component: DarkTemplate },
  ];

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleViewPreview = () => {
    if (selectedTemplate) {
      navigation.navigate('FinalPreview', { 
        cardData, 
        template: selectedTemplate 
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* ========== HEADER SECTION ========== */}
      <View style={layoutStyles.headerSection}>
        {/* Back Button */}
        <TouchableOpacity 
          onPress={handleBack}
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 16, paddingTop: 20 }}>
        
        {/* Title Section */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[layoutStyles.mainTitle, { fontSize: 24, marginBottom: 8 }]}>Select a Template</Text>
          <Text style={[layoutStyles.subtitle, { fontSize: 14 }]}>Choose a design for your digital business card</Text>
        </View>

        {/* Template Cards */}
        <View>
          {templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={[
                styles.templateCard,
                selectedTemplate === template.id && styles.templateCardSelected
              ]}
              onPress={() => handleSelectTemplate(template.id)}
            >
              {/* Card Preview */}
              <View style={styles.cardPreviewWrapper}>
                {(() => {
                  const TemplateComponent = template.component;
                  return <TemplateComponent data={cardData} />;
                })()}
              </View>

              {/* Template Name and Selection */}
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <View style={[styles.radioButton, selectedTemplate === template.id && styles.radioButtonSelected]}>
                  {selectedTemplate === template.id && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.continueButton, !selectedTemplate && styles.continueButtonDisabled]} 
          onPress={handleViewPreview}
          disabled={!selectedTemplate}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.continueButtonText}>View Final Preview</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TemplatePreviewScreen;
