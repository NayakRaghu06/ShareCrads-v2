// import React, { useState, useEffect, useRef } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// import ViewShot from "react-native-view-shot";
// import * as MediaLibrary from "expo-media-library";
// import * as Sharing from "expo-sharing";
// import * as Print from "expo-print";
// import QRCode from "react-native-qrcode-svg";

// import ClassicTemplate from '../../components/templates/ClassicTemplate';
// import ModernTemplate from '../../components/templates/ModernTemplate';
// import MinimalTemplate from '../../components/templates/MinimalTemplate';
// import DarkTemplate from '../../components/templates/DarkTemplate';

// import { layoutStyles } from '../../styles/screens/personalDetailsLayoutStyles';
// import { getUser } from '../../database/userQueries';

// const TEMPLATE_COMPONENTS = {
//   classic: ClassicTemplate,
//   modern: ModernTemplate,
//   minimal: MinimalTemplate,
//   dark: DarkTemplate,
// };

// export default function FinalPreviewScreen({ route, navigation }) {
//   const { template = 'classic' } = route?.params || {};
//   const [cardData, setCardData] = useState({});
//   const [userInitial, setUserInitial] = useState('N');
//   const viewRef = useRef();

//   useEffect(() => {
//     const user = getUser();
//     if (user) {
//       setCardData(user);
//       const initial = user.name
//         ? user.name.trim().charAt(0).toUpperCase()
//         : 'N';
//       setUserInitial(initial);
//     }
//   }, []);

//   const SelectedComponent =
//     TEMPLATE_COMPONENTS[template] || ClassicTemplate;

//   const handleDownload = async () => {
//     try {
//       const uri = await viewRef.current.capture();
//       await MediaLibrary.requestPermissionsAsync();
//       await MediaLibrary.saveToLibraryAsync(uri);
//       Alert.alert("Success", "Card saved to gallery 📸");
//     } catch (e) {
//       Alert.alert("Error", e.message);
//     }
//   };

//   const handleShare = async () => {
//     try {
//       const uri = await viewRef.current.capture();
//       await Sharing.shareAsync(uri);
//     } catch (e) {
//       Alert.alert("Error", e.message);
//     }
//   };

//   const handleExportPDF = async () => {
//     const html = `
//       <html>
//         <body style="font-family: Arial; padding:20px;">
//           <h2>${cardData.name || ""}</h2>
//           <p>${cardData.designation || ""}</p>
//           <p>${cardData.phone || ""}</p>
//           <p>${cardData.email || ""}</p>
//           <p>${cardData.companyName || ""}</p>
//           <p>${cardData.website || ""}</p>
//         </body>
//       </html>
//     `;
//     const { uri } = await Print.printToFileAsync({ html });
//     await Sharing.shareAsync(uri);
//   };

//   const qrValue = JSON.stringify(cardData);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
//       <StatusBar barStyle="dark-content" />

//       {/* HEADER */}
//       <View style={layoutStyles.headerSection}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={28} color="#D4AF37" />
//         </TouchableOpacity>

//         <Text style={layoutStyles.appTitle}>
//           DIGITAL BUSINESS CARD
//         </Text>

//         <TouchableOpacity
//           style={layoutStyles.profileIcon}
//           onPress={() => navigation.navigate("Profile")}
//         >
//           <Text style={layoutStyles.profileIconText}>
//             {userInitial}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

//         {/* CARD VIEW CAPTURE */}
//         <ViewShot ref={viewRef} options={{ format: "png", quality: 1 }}>
//           <View style={{ padding: 20 }}>
//             <SelectedComponent data={cardData} />

//             {/* Show Only Filled Fields */}
//             {!!cardData.phone && <Text>📞 {cardData.phone}</Text>}
//             {!!cardData.email && <Text>📧 {cardData.email}</Text>}
//             {!!cardData.companyName && <Text>🏢 {cardData.companyName}</Text>}
//             {!!cardData.website && <Text>🌐 {cardData.website}</Text>}
//             {!!cardData.whatsapp && <Text>💬 {cardData.whatsapp}</Text>}
//             {!!cardData.linkedin && <Text>🔗 {cardData.linkedin}</Text>}
//             {!!cardData.instagram && <Text>📷 {cardData.instagram}</Text>}
//             {!!cardData.twitter && <Text>🐦 {cardData.twitter}</Text>}
//             {!!cardData.facebook && <Text>📘 {cardData.facebook}</Text>}
//             {!!cardData.youtube && <Text>▶️ {cardData.youtube}</Text>}

//             {/* QR Code */}
//             <View style={{ marginTop: 20, alignItems: "center" }}>
//               <QRCode value={qrValue} size={100} />
//             </View>
//           </View>
//         </ViewShot>

//         {/* BOTTOM BUTTONS */}
//         <View style={{ marginHorizontal: 20, marginTop: 30 }}>

//           <TouchableOpacity
//             style={styles.primaryButton}
//             onPress={handleDownload}
//           >
//             <Ionicons name="download" size={20} color="#FFFFFF" />
//             <Text style={styles.primaryText}>Download Image</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.secondaryButton}
//             onPress={handleShare}
//           >
//             <Ionicons name="share-social" size={20} color="#D4AF37" />
//             <Text style={styles.secondaryText}>Share Image</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.secondaryButton}
//             onPress={handleExportPDF}
//           >
//             <Ionicons name="document" size={20} color="#D4AF37" />
//             <Text style={styles.secondaryText}>Export as PDF</Text>
//           </TouchableOpacity>

//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   primaryButton: {
//     backgroundColor: "#D4AF37",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 15,
//   },
//   primaryText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//     marginLeft: 8,
//   },
//   secondaryButton: {
//     backgroundColor: "#F5F5F5",
//     borderWidth: 2,
//     borderColor: "#D4AF37",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 15,
//   },
//   secondaryText: {
//     color: "#D4AF37",
//     fontWeight: "600",
//     marginLeft: 8,
//   },
// });

// // npx expo install react-native-view-shot
// // npx expo install expo-media-library
// // npx expo install expo-sharing
// // npx expo install expo-print
// // npx expo install react-native-qrcode-svg

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

import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
// QRCode is optional native dependency; load dynamically and fallback to external image if unavailable

import ClassicTemplate from "../../components/templates/ClassicTemplate";
import ModernTemplate from "../../components/templates/ModernTemplate";
import MinimalTemplate from "../../components/templates/MinimalTemplate";
import DarkTemplate from "../../components/templates/DarkTemplate";

import { layoutStyles } from "../../styles/screens/personalDetailsLayoutStyles";
import { getUser } from "../../database/userQueries";
import { saveDashboard, getDashboard, addDashboardCard } from '../../utils/storage';

const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  dark: DarkTemplate,
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

  const userInitial = effectiveCardData?.name ? effectiveCardData.name.trim().charAt(0).toUpperCase() : 'N';

  const previewOnly = route?.params?.previewOnly === true;

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
            <View style={{ marginBottom: 6 }}><Text style={{ color: '#6B7280' }}>Designation:</Text><Text style={{ color: '#111' }}>{effectiveCardData.designation || effectiveCardData.role || ''}</Text></View>
            <View style={{ marginBottom: 6 }}><Text style={{ color: '#6B7280' }}>Company:</Text><Text style={{ color: '#111' }}>{effectiveCardData.companyName || effectiveCardData.company || ''}</Text></View>
            <View style={{ marginBottom: 6 }}><Text style={{ color: '#6B7280' }}>Description:</Text><Text style={{ color: '#111' }}>{effectiveCardData.businessDescription || effectiveCardData.description || ''}</Text></View>
            <View style={{ marginBottom: 6 }}><Text style={{ color: '#6B7280' }}>Mobile:</Text><Text style={{ color: '#111' }}>{effectiveCardData.phone || effectiveCardData.mobile || effectiveCardData.whatsapp || ''}</Text></View>
            <View style={{ marginBottom: 6 }}><Text style={{ color: '#6B7280' }}>Email:</Text><Text style={{ color: '#111' }}>{effectiveCardData.email || ''}</Text></View>
            <View><Text style={{ color: '#6B7280' }}>Address:</Text><Text style={{ color: '#111' }}>{effectiveCardData.address || effectiveCardData.location || ''}</Text></View>
          </View>

          {/* All Fields list shown in preview-only for verification */}
          <View style={{ marginTop: 14, padding: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>All Fields</Text>
            {Object.entries(effectiveCardData || {}).map(([k, v]) => (
              <View key={k} style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Text style={{ color: '#6B7280', width: 140 }}>{k}:</Text>
                <Text style={{ flex: 1, color: '#111' }}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</Text>
              </View>
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

  // Share Image
  const handleShare = async () => {
    try {
      if (!viewRef.current || !viewRef.current.capture) {
        Alert.alert('Error', 'Unable to capture view');
        return;
      }
      const uri = await viewRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert("Error", e.message);
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

      {/* HEADER */}
      <View style={layoutStyles.headerSection}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#D4AF37" />
        </TouchableOpacity>

        <Text style={layoutStyles.appTitle}>
          DIGITAL BUSINESS CARD
        </Text>

        <View style={layoutStyles.profileIcon}>
          <Text style={layoutStyles.profileIconText}>
            {userInitial}
          </Text>
        </View>
      </View>

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
                // Capture the rendered card as an image so dashboard shows thumbnail
                let savedImage = null;
                try {
                  if (viewRef.current && viewRef.current.capture) {
                    savedImage = await viewRef.current.capture();
                  }
                } catch (captureErr) {
                  console.warn('Capture failed', captureErr);
                  savedImage = null;
                }

                const toSave = savedImage
                  ? { ...effectiveCardData, savedImage }
                  : { ...effectiveCardData };

                await addDashboardCard(toSave);
                Alert.alert('Success', 'Card saved successfully 🎉');
                navigation.navigate('Landing');
              } catch (e) {
                Alert.alert('Error', e.message || 'Failed to save card');
              }
            }}
          >
            <Ionicons name="bookmark" size={20} color="#FFFFFF" />
            <Text style={[styles.primaryText, { marginLeft: 10 }]}>Save Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={20} color="#D4AF37" />
            <Text style={styles.secondaryText}>Share Card</Text>
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