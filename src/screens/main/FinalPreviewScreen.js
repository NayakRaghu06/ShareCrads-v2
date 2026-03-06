
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import shareCardAsVCard from '../../utils/shareVCard';
import AppHeader from '../../components/common/AppHeader';
// QRCode is optional native dependency; load dynamically and fallback to external image if unavailable

import ClassicTemplate from "../../components/templates/ClassicTemplate";
import ModernTemplate from "../../components/templates/ModernTemplate";
import DarkTemplate from "../../components/templates/DarkTemplate";
import ExpandableField from '../../components/common/ExpandableField';

import { getUser } from "../../database/userQueries";
import { apiFetch } from '../../utils/api';

const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  dark: DarkTemplate,
};

const TEMPLATE_ID_MAP = {
  classic: 1,
  modern: 2,
  dark: 3,
};

export default function FinalPreviewScreen({ route, navigation }) {
  const { template = "classic" } = route?.params || {};
  const [selectedTemplate, setSelectedTemplate] = useState(template);
  const viewRef = useRef();

  // Compute merged card data from DB + incoming params. This avoids setState inside effects and infinite loops.
  const effectiveCardData = React.useMemo(() => {
    try {
      const rc = route?.params?.cardData || {};
      const stored = getUser() || {};
      return { ...stored, ...rc };
    } catch (e) {
      console.warn("Failed to compute effectiveCardData", e);
      return route?.params?.cardData || {};
    }
  }, [route?.params?.cardData]);

  // Keep selected template in sync if navigation updates it
  useEffect(() => {
    const t = route?.params?.template;
    if (t) setSelectedTemplate(t);
  }, [route?.params?.template]);

  const SelectedComponent =
    TEMPLATE_COMPONENTS[selectedTemplate] || ClassicTemplate;

  const previewOnly = route?.params?.previewOnly === true;
  const [expandedField, setExpandedField] = useState(null);

  const getOrHydrateUserId = async () => {
    const storedUserId = await AsyncStorage.getItem('loggedInUserId');
    if (storedUserId) return storedUserId;

    const { res, data } = await apiFetch('/user/profile');
    if (!res.ok || !data?.data?.userId) return null;

    const fetchedUserId = String(data.data.userId);
    await AsyncStorage.setItem('loggedInUserId', fetchedUserId);
    return fetchedUserId;
  };

  if (previewOnly) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <ViewShot ref={viewRef} options={{ format: 'png', quality: 1 }}>
            <View style={{ padding: 20 }}>
              <SelectedComponent userData={effectiveCardData} />
            </View>
          </ViewShot>

          {/* Key Info */}
          <View style={{ marginTop: 20, padding: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Key Info</Text>
            <ExpandableField label="Designation" value={effectiveCardData.designation || effectiveCardData.role || ''} fieldKey="preview-designation" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} labelStyle={{ color: '#6B7280', width: '40%' }} valueStyle={{ color: '#111', width: '100%' }} />
            <ExpandableField label="Company Name" value={effectiveCardData.companyName || effectiveCardData.company || ''} fieldKey="preview-companyName" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} labelStyle={{ color: '#6B7280', width: '40%' }} valueStyle={{ color: '#111', width: '100%' }} />
            <ExpandableField label="Business Description" value={effectiveCardData.businessDescription || effectiveCardData.description || ''} fieldKey="preview-businessDescription" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} labelStyle={{ color: '#6B7280', width: '40%' }} valueStyle={{ color: '#111', width: '100%' }} />
            <ExpandableField label="Mobile" value={effectiveCardData.phone || effectiveCardData.mobile || effectiveCardData.whatsapp || ''} fieldKey="preview-mobile" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} labelStyle={{ color: '#6B7280', width: '40%' }} valueStyle={{ color: '#111', width: '100%' }} />
            <ExpandableField label="Email" value={effectiveCardData.email || ''} fieldKey="preview-email" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} labelStyle={{ color: '#6B7280', width: '40%' }} valueStyle={{ color: '#111', width: '100%' }} />
            <ExpandableField label="Website" value={effectiveCardData.website || ''} fieldKey="preview-website" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} labelStyle={{ color: '#6B7280', width: '40%' }} valueStyle={{ color: '#111', width: '100%' }} />
            <ExpandableField label="Address" value={effectiveCardData.address || effectiveCardData.location || ''} fieldKey="preview-address" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} labelStyle={{ color: '#6B7280', width: '40%' }} valueStyle={{ color: '#111', width: '100%' }} />
          </View>

          {/* All Fields list shown in preview-only for verification */}
          <View style={{ marginTop: 14, padding: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>All Fields</Text>
            {Object.entries(effectiveCardData || {}).map(([k, v]) => (
              <ExpandableField key={k} label={`${k}:`} value={typeof v === 'object' ? JSON.stringify(v) : String(v)} fieldKey={`all-${k}`} expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} labelStyle={{ color: '#6B7280', width: '40%' }} valueStyle={{ color: '#111', width: '100%' }} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Download Image
  const handleDownload = async () => {
    try {
      if (!viewRef.current || !viewRef.current.capture) {
        Alert.alert('Error', 'Unable to capture view');
        return;
      }
      const uri = await viewRef.current.capture();
      await MediaLibrary.requestPermissionsAsync();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Card saved to gallery 📸");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  // Share vCard (delegates to utils/shareVCard)
  const handleShare = async () => {
    try {
      await shareCardAsVCard(effectiveCardData);
    } catch (e) {
      Alert.alert("Error", e.message || String(e));
    }
  };

  // Export PDF
  const handleExportPDF = async () => {
    const html = `
      <html>
        <body style="font-family: Arial; padding:20px;">
          ${effectiveCardData.name ? `<h2>${effectiveCardData.name}</h2>` : ""}
          ${effectiveCardData.designation ? `<p>${effectiveCardData.designation}</p>` : ""}
          ${effectiveCardData.phone ? `<p>${effectiveCardData.phone}</p>` : ""}
          ${effectiveCardData.email ? `<p>${effectiveCardData.email}</p>` : ""}
          ${effectiveCardData.companyName ? `<p>${effectiveCardData.companyName}</p>` : ""}
          ${effectiveCardData.website ? `<p>${effectiveCardData.website}</p>` : ""}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" />

      <AppHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* CARD CAPTURE */}
        <ViewShot ref={viewRef} options={{ format: "png", quality: 1 }}>
          <View style={{ padding: 20 }}>
            <SelectedComponent userData={effectiveCardData} />
          </View>
        </ViewShot>

        {/* Preview shows only the rendered card; debug panels removed */}

        {/* BUTTONS */}
        <View style={{ marginHorizontal: 20, marginTop: 30 }}>
          {/* Premium Save Card button (gold) */}
          <TouchableOpacity
            style={styles.premiumButton}
            onPress={async () => {
              try {
                const userId = await getOrHydrateUserId();
                if (!userId) {
                  Alert.alert('Session Expired', 'Please login again.');
                  navigation.replace('Login');
                  return;
                }

                const d = effectiveCardData;
                const slug = selectedTemplate || d.templateSlug || 'classic';
                const resolvedTemplateId =
                  Number(d.templateId) ||
                  Number(route?.params?.templateId) ||
                  TEMPLATE_ID_MAP[slug] ||
                  TEMPLATE_ID_MAP.classic;
                // POST /api/cards/business-card
                const payload = {
                  name: d.name || '',
                  designation: d.designation || d.role || '',
                  companyName: d.companyName || d.company || '',
                  phoneNumber: d.phone || d.phoneNumber || d.mobile || '',
                  email: d.email || null,
                  address: d.address || d.location || null,
                  keywords: d.searchKeywords || d.keywords || null,
                  businessCategory: d.businessCategory || null,
                  businessSubcategory: d.businessSubCategory || d.businessSubcategory || null,
                  clients: d.clients || null,
                  businessDescription: d.businessDescription || d.description || null,
                  linkedin: d.linkedin || null,
                  facebook: d.facebook || null,
                  instagram: d.instagram || null,
                  twitter: d.twitter || null,
                  whatsappUrl: d.whatsapp || d.whatsappUrl || null,
                  templateSlug: slug,
                  templateId: resolvedTemplateId,
                };
                console.log('[SaveCard] payload:', JSON.stringify(payload));
                const { res, data } = await apiFetch('/api/cards/business-card', {
                  method: 'POST',
                  body: JSON.stringify(payload),
                });
                console.log('[SaveCard] status:', res.status, 'data:', JSON.stringify(data));
                if (res.status === 401) { navigation.replace('Login'); return; }
                if (res.ok) {
                  Alert.alert('Success', 'Card saved successfully!', [
                    {
                      text: 'OK',
                      onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Landing' }] }),
                    },
                  ]);
                } else {
                  Alert.alert('Error', `[${res.status}] ${data?.message || JSON.stringify(data) || 'Failed to save card'}`);
                }
              } catch (e) {
                Alert.alert('Error', e.message || 'Failed to save card');
              }
            }}
          >
            <Ionicons name="bookmark" size={20} color="#FFFFFF" />
            <Text style={[styles.primaryText, { marginLeft: 10 }]}>Save Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#D4AF37",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "#D4AF37",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  secondaryText: {
    color: "#D4AF37",
    fontWeight: "600",
    marginLeft: 8,
  },
  premiumButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
