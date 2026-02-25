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

        {/* BUTTONS */}
        <View style={{ marginHorizontal: 20, marginTop: 30 }}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('TemplatePreview', { cardData: effectiveCardData })}
          >
            <Ionicons name="eye" size={20} color="#D4AF37" />
            <Text style={styles.secondaryText}>Choose Template</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleDownload}
          >
            <Ionicons name="download" size={20} color="#FFFFFF" />
            <Text style={styles.primaryText}>Download Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={20} color="#D4AF37" />
            <Text style={styles.secondaryText}>Share Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleExportPDF}
          >
            <Ionicons name="document" size={20} color="#D4AF37" />
            <Text style={styles.secondaryText}>Export as PDF</Text>
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
});