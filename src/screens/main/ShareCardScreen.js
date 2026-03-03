// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   Image,
//   Linking
//     Alert,
//     Linking
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// export default function ShareCardScreen({ navigation, route }) {

//   const { cardData } = route.params;
//   const [mobile, setMobile] = useState('');
//   const [userStatus, setUserStatus] = useState("none"); 
//   // "none" | "found" | "notfound"

//   const cardLink = `https://sharecards.in/card/${cardData.phone}`;
//   const message = `Check my Digital Business Card 👇\n\n${cardLink}`;

//     // Professional WhatsApp invite function
//     const handleSendInvite = async () => {
//       if (mobile.length !== 10) return;

//       const inviteMessage =
//         `Hi 👋\n\nI am using ShareCards to share my Digital Business Card.\n\nJoin here:\nhttps://sharecards.in\n\nIt’s easy and free!`;

//       const url = `https://wa.me/91${mobile}?text=${encodeURIComponent(inviteMessage)}`;

//       const supported = await Linking.canOpenURL(url);
//       if (supported) {
//         await Linking.openURL(url);
//       } else {
//         Alert.alert("WhatsApp not installed");
//       }
//     };
//   const handleCheckUser = () => {
//     if (mobile === "9876543210") {
//       setUserStatus("found");
//     } else {
//       setUserStatus("notfound");
//     }
//   };

//   const handleWhatsApp = async () => {
//     if (mobile.length !== 10) return;

//     const url = `https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`;
//     await Linking.openURL(url);
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>

//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={26} color="#111" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Share Card</Text>
//         <View style={{ width: 26 }} />
//       </View>

//       <View style={styles.container}>

//         {/* INPUT SECTION */}
//         <Text style={styles.label}>Enter Mobile Number</Text>

//         <View style={styles.inputWrapper}>
//           <View style={styles.countryBox}>
//             <Text style={styles.countryText}>+91</Text>
//           </View>
//           <TextInput
//             style={styles.input}
//             placeholder="10 digit mobile number"
//             placeholderTextColor="#999"
//             keyboardType="phone-pad"
//             maxLength={10}
//             value={mobile}
//             onChangeText={setMobile}
//           />
//         </View>

//         <TouchableOpacity style={styles.checkBtn} onPress={handleCheckUser}>
//           <Text style={styles.checkBtnText}>Check User</Text>
//         </TouchableOpacity>

//         {/* USER FOUND */}
//         {userStatus === "found" && (
//           <>
//             <View style={styles.successCard}>
//               <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
//               <Text style={styles.successText}>  User Found!</Text>
//             </View>

//             <View style={styles.userCard}>
//               <Image
//                 source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
//                 style={styles.profile}
//               />
//               <View>
//                 <Text style={styles.name}>Rahul Sharma</Text>
//                 <Text style={styles.designation}>Software Engineer</Text>
//                 <Text style={styles.company}>DBC Technologies</Text>
//               </View>
//             </View>

//             <Text style={styles.shareTitle}>Choose Share Option</Text>

//             <TouchableOpacity style={styles.shareInAppBtn}>
//               <Text style={styles.shareInAppText}>Share In App</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
//               <Ionicons name="logo-whatsapp" size={20} color="#fff" />
//               <Text style={styles.whatsappText}>  Share on WhatsApp</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {/* USER NOT FOUND */}
//         {userStatus === "notfound" && (
//           <>
//             <View style={styles.errorCard}>
//               <Ionicons name="close-circle" size={20} color="#FF4D4F" />
//               <Text style={styles.errorText}>  User Not Found</Text>
//             </View>

//             <Text style={styles.errorDesc}>
//               This number is not registered on ShareCards.
//             </Text>

//             <TouchableOpacity style={styles.inviteBtn}>
//               <TouchableOpacity style={styles.inviteBtn} onPress={handleSendInvite}>
//                 <Text style={styles.inviteText}>Send Invitation</Text>
//               </TouchableOpacity>
//         )}

//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({

//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F6F8FB',
//   },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 18,
//     backgroundColor: '#fff',
//   },

//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#111',
//   },

//   container: {
//     paddingHorizontal: 20,
//     marginTop: 25,
//   },

//   label: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 10,
//   },

//   inputWrapper: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 6,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     marginBottom: 18,
//     elevation: 2,
//   },

//   countryBox: {
//     backgroundColor: '#F3F4F6',
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     borderRadius: 10,
//   },

//   countryText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#111',
//   },

//   input: {
//     flex: 1,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     color: '#111',
//   },

//   checkBtn: {
//     backgroundColor: '#2563EB',
//     paddingVertical: 16,
//     borderRadius: 14,
//     alignItems: 'center',
//     elevation: 4,
//   },

//   checkBtnText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//   },

//   successCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E8FCEB',
//     padding: 14,
//     borderRadius: 12,
//     marginTop: 24,
//   },

//   successText: {
//     color: '#16A34A',
//     fontWeight: '600',
//   },

//   userCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginTop: 15,
//     elevation: 3,
//   },

//   profile: {
//     width: 55,
//     height: 55,
//     borderRadius: 30,
//     marginRight: 15,
//   },

//   name: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111',
//   },

//   designation: {
//     color: '#2563EB',
//     marginTop: 2,
//   },

//   company: {
//     color: '#666',
//     marginTop: 2,
//   },

//   shareTitle: {
//     textAlign: 'center',
//     marginTop: 18,
//     marginBottom: 12,
//     fontWeight: '600',
//     color: '#444',
//   },

//   shareInAppBtn: {
//     backgroundColor: '#2563EB',
//     paddingVertical: 15,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginBottom: 12,
//   },

//   shareInAppText: {
//     color: '#fff',
//     fontWeight: '700',
//   },

//   whatsappBtn: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#25D366',
//     paddingVertical: 15,
//     borderRadius: 14,
//   },

//   whatsappText: {
//     color: '#fff',
//     fontWeight: '700',
//   },

//   errorCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFEDEE',
//     padding: 14,
//     borderRadius: 12,
//     marginTop: 24,
//   },

//   errorText: {
//     color: '#FF4D4F',
//     fontWeight: '600',
//   },

//   errorDesc: {
//     textAlign: 'center',
//     marginTop: 14,
//     color: '#555',
//   },

//   inviteBtn: {
//     backgroundColor: '#FF8A00',
//     marginTop: 18,
//     paddingVertical: 16,
//     borderRadius: 14,
//     alignItems: 'center',
//   },

//   inviteText: {
//     color: '#fff',
//     fontWeight: '700',
//   },

// });

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Linking,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ShareCardScreen({ navigation, route }) {

  const { cardData } = route.params;

  const [mobile, setMobile] = useState('');
  const [userStatus, setUserStatus] = useState("none"); 
  // "none" | "found" | "notfound"

  const cardLink = `https://sharecards.in/card/${cardData.phone}`;
  const message = `Check my Digital Business Card 👇\n\n${cardLink}`;

  // ✅ CHECK USER (Demo)
  const handleCheckUser = () => {
    if (mobile.length !== 10) {
      Alert.alert("Enter valid 10 digit mobile number");
      return;
    }

    if (mobile === "9876543210") {
      setUserStatus("found");
    } else {
      setUserStatus("notfound");
    }
  };

  // ✅ SHARE CARD ON WHATSAPP
  const handleWhatsApp = async () => {
    if (mobile.length !== 10) {
      Alert.alert("Enter valid mobile number");
      return;
    }

    const url = `https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Unable to open WhatsApp");
    }
  };

  // ✅ SEND INVITE FUNCTION
  const handleSendInvite = async () => {
    if (mobile.length !== 10) {
      Alert.alert("Enter valid mobile number");
      return;
    }

    const inviteMessage =
      `Hi 👋\n\nI am using ShareCards to share my Digital Business Card.\n\nJoin here:\nhttps://sharecards.in\n\nIt’s easy and free!`;

    const url = `https://wa.me/91${mobile}?text=${encodeURIComponent(inviteMessage)}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("WhatsApp not installed");
      }
    } catch (error) {
      Alert.alert("Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Card</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.container}>

        {/* INPUT SECTION */}
        <Text style={styles.label}>Enter Mobile Number</Text>

        <View style={styles.inputWrapper}>
          <View style={styles.countryBox}>
            <Text style={styles.countryText}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="10 digit mobile number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
            value={mobile}
            onChangeText={setMobile}
          />
        </View>

        <TouchableOpacity style={styles.checkBtn} onPress={handleCheckUser}>
          <Text style={styles.checkBtnText}>Check User</Text>
        </TouchableOpacity>

        {/* USER FOUND */}
        {userStatus === "found" && (
          <>
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
              <Text style={styles.successText}>  User Found!</Text>
            </View>

            <View style={styles.userCard}>
              <Image
                source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
                style={styles.profile}
              />
              <View>
                <Text style={styles.name}>Rahul Sharma</Text>
                <Text style={styles.designation}>Software Engineer</Text>
                <Text style={styles.company}>DBC Technologies</Text>
              </View>
            </View>

            <Text style={styles.shareTitle}>Choose Share Option</Text>

            <TouchableOpacity style={styles.shareInAppBtn}>
              <Text style={styles.shareInAppText}>Share In App</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text style={styles.whatsappText}>  Share on WhatsApp</Text>
            </TouchableOpacity>
          </>
        )}

        {/* USER NOT FOUND */}
        {userStatus === "notfound" && (
          <>
            <View style={styles.errorCard}>
              <Ionicons name="close-circle" size={20} color="#FF4D4F" />
              <Text style={styles.errorText}>  User Not Found</Text>
            </View>

            <Text style={styles.errorDesc}>
              This number is not registered on ShareCards.
            </Text>

            <TouchableOpacity 
              style={styles.inviteBtn} 
              onPress={handleSendInvite}
            >
              <Text style={styles.inviteText}>Send Invitation</Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#fff',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },

  container: {
    paddingHorizontal: 20,
    marginTop: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },

  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
    elevation: 2,
  },

  countryBox: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },

  countryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },

  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111',
  },

  checkBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
  },

  checkBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8FCEB',
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
  },

  successText: {
    color: '#16A34A',
    fontWeight: '600',
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 15,
    elevation: 3,
  },

  profile: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  designation: {
    color: '#2563EB',
    marginTop: 2,
  },

  company: {
    color: '#666',
    marginTop: 2,
  },

  shareTitle: {
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 12,
    fontWeight: '600',
    color: '#444',
  },

  shareInAppBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },

  shareInAppText: {
    color: '#fff',
    fontWeight: '700',
  },

  whatsappBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 15,
    borderRadius: 14,
  },

  whatsappText: {
    color: '#fff',
    fontWeight: '700',
  },

  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEDEE',
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
  },

  errorText: {
    color: '#FF4D4F',
    fontWeight: '600',
  },

  errorDesc: {
    textAlign: 'center',
    marginTop: 14,
    color: '#555',
  },

  inviteBtn: {
    backgroundColor: '#FF8A00',
    marginTop: 18,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  inviteText: {
    color: '#fff',
    fontWeight: '700',
  },

});