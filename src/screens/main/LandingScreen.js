// import React, { useState, useEffect } from 'react';
// import { Modal } from 'react-native';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { landingStyles } from '../../styles/screens/landingStyles';
// import COLORS from '../../styles/colors';
// import { getDBCUsers } from '../../utils/contacts';
// import { getDashboard, clearUser } from '../../utils/storage';

// export default function LandingScreen({ navigation }) {
//   const [contacts, setContacts] = useState([]);
//   const [dashboardCards, setDashboardCards] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredContacts, setFilteredContacts] = useState([]);
//   const [activeTab, setActiveTab] = useState('home');
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [isListening, setIsListening] = useState(false);

 

//   useEffect(() => {
//     loadContacts();
//     loadDashboardCards();
//     const unsubscribe = navigation.addListener('focus', loadDashboardCards);
//     return unsubscribe;
//   }, []);

//   const loadDashboardCards = async () => {
//     try {
//       let cards = await getDashboard();
//       if (!Array.isArray(cards)) cards = [];
//       setDashboardCards(cards);
//     } catch (e) {
//       setDashboardCards([]);
//     }
//   };

//   const loadContacts = async () => {
//     try {
//       const users = await getDBCUsers();
//       setContacts(users || []);
//       setFilteredContacts(users || []);
//     } catch (error) {
//       console.log('Error loading contacts:', error);
//     }
//   };

//   const handleSearch = (text) => {
//     setSearchQuery(text);
//     if (!text.trim()) {
//       setFilteredContacts(contacts);
//     } else {
//       const filtered = contacts.filter(
//         (contact) =>
//           (contact.name &&
//             contact.name.toLowerCase().includes(text.toLowerCase())) ||
//           (contact.designation &&
//             contact.designation.toLowerCase().includes(text.toLowerCase()))
//       );
//       setFilteredContacts(filtered);
//     }
//   };

//   // -------- Handlers --------

//   const handleCreateCard = () => {
//     navigation.navigate('PersonalDetails');
//   };

//   const handleHomePress = () => {
//     setActiveTab('home');
//   };

//   const handleContactsPress = () => {
//     setActiveTab('contacts');
//   };

//   const handleMicPress = () => {
//     setIsListening(!isListening);
//   };

//   const handleLogout = async () => {
//     await clearUser();
//     navigation.replace('Login');
//   };

//   // -------- UI --------

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       {/* Custom Top Bar: Menu | Search | Profile */}
//       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8, backgroundColor: '#fff', elevation: 2 }}>
//         {/* Menu Button (left) */}
//         <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 6 }}>
//           <Ionicons name="menu" size={28} color={COLORS.accent} />
//         </TouchableOpacity>
//         {/* Search Bar (center) */}
//         <View style={{ flex: 1, marginHorizontal: 10, backgroundColor: '#f2f2f2', borderRadius: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, height: 38 }}>
//           <Ionicons name="search" size={20} color="#999" style={{ marginRight: 6 }} />
//           <TextInput
//             style={{ flex: 1, fontSize: 15, color: '#222', paddingVertical: 0 }}
//             placeholder="Search..."
//             placeholderTextColor="#999"
//             value={searchQuery}
//             onChangeText={handleSearch}
//             returnKeyType="search"
//           />
//           <TouchableOpacity onPress={handleMicPress}>
//             <Ionicons name="mic" size={20} color={COLORS.accent} />
//           </TouchableOpacity>
//         </View>
//         {/* Profile Button (right) */}
//         <TouchableOpacity onPress={() => navigation.push('Profile', { fromScreen: 'Landing' })} style={{ padding: 6 }}>
//           <Ionicons name="person-circle" size={32} color={COLORS.accent} />
//         </TouchableOpacity>
//       </View>

//       {/* Left Menu Modal */}
//       <Modal
//         visible={menuVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setMenuVisible(false)}
//       >
//         <TouchableOpacity
//           style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
//           activeOpacity={1}
//           onPressOut={() => setMenuVisible(false)}
//         >
//           <View style={{ width: 260, height: '100%', backgroundColor: '#fff', paddingTop: 40, paddingHorizontal: 20, position: 'absolute', left: 0, top: 0, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 2, height: 0 } }}>
//             <TouchableOpacity onPress={() => setMenuVisible(false)} style={{ position: 'absolute', top: 16, right: 16 }}>
//               <Ionicons name="close" size={28} color={COLORS.accent} />
//             </TouchableOpacity>
//             <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 32, color: COLORS.accent }}>Menu</Text>
//             {/* Settings */}
//             <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28 }} onPress={() => { setMenuVisible(false); navigation.navigate('Profile', { fromScreen: 'Landing', openSettings: true }); }}>
//               <Ionicons name="settings-outline" size={22} color={COLORS.accent} style={{ marginRight: 16 }} />
//               <Text style={{ fontSize: 16, color: '#222' }}>Settings</Text>
//             </TouchableOpacity>
//             {/* Saved Cards */}
//             <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 10, color: COLORS.accent }}>Saved Cards</Text>
//             {(Array.isArray(dashboardCards) && dashboardCards.length === 0) && (
//               <Text style={{ color: '#171616', marginBottom: 20 }}>No cards saved</Text>
//             )}
//             {(Array.isArray(dashboardCards) ? dashboardCards : []).map((card, idx) => (
//               <TouchableOpacity
//                 key={idx}
//                 style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' }}
//                 onPress={() => {
//                   setMenuVisible(false);
//                   navigation.navigate('TemplatePreview', { cardData: card });
//                 }}
//               >
//                 <Text style={{ fontSize: 15, color: '#222' }}>{card.name || 'Unnamed'}</Text>
//                 <Text style={{ fontSize: 12, color: '#888' }}>{card.template ? `Template: ${card.template}` : ''}</Text>
//               </TouchableOpacity>
//             ))}
//             {/* Help & Support */}
//             <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 32 }} onPress={() => { setMenuVisible(false); navigation.navigate('HelpSupport'); }}>
//               <Ionicons name="help-circle-outline" size={22} color={COLORS.accent} style={{ marginRight: 16 }} />
//               <Text style={{ fontSize: 16, color: '#222' }}>Help & Support</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 30 }}
//       >
       
//         {/* ...removed duplicate search bar... */}

//         {/* CONTACTS LIST */}
//         <View style={landingStyles.contactsListContainer}>
//           {filteredContacts.length > 0 ? (
//             filteredContacts.map((contact, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={landingStyles.contactCard}
//                 onPress={() =>
//                   navigation.navigate('SelectTemplate', { contact })
//                 }
//               >
//                 <View style={landingStyles.contactInfo}>
//                   <Text style={landingStyles.contactName}>
//                     {contact.name || 'Unknown'}
//                   </Text>
//                 </View>
//                 <View style={landingStyles.contactCategory}>
//                   <Text style={landingStyles.contactCategoryText}>
//                     {contact.designation ||
//                       contact.companyName ||
//                       'Professional'}
//                   </Text>
//                   <Ionicons
//                     name="chevron-forward"
//                     size={20}
//                     color="#999"
//                   />
//                 </View>
//               </TouchableOpacity>
//             ))
//           ) : (
//             <View style={landingStyles.emptyContainer}>
//               <Ionicons
//                 name="person-add"
//                 size={60}
//                 color={COLORS.accent}
//               />
//               <Text style={landingStyles.emptyText}>
//                 No contacts found
//               </Text>
//               <TouchableOpacity
//                 style={landingStyles.createButton}
//                 onPress={handleCreateCard}
//               >
//                 <Ionicons
//                   name="add-circle"
//                   size={20}
//                   color="#FFF"
//                 />
//                 <Text style={landingStyles.createButtonText}>
//                   Create Your Card
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* FOOTER TABS */}
//       <View style={landingStyles.footerTabs}>
//         <TouchableOpacity
//           style={[
//             landingStyles.footerTab,
//             activeTab === 'home' &&
//               landingStyles.footerTabActive,
//           ]}
//           onPress={handleHomePress}
//         >
//           <Ionicons
//             name={activeTab === 'home' ? 'home' : 'home-outline'}
//             size={24}
//             color={
//               activeTab === 'home' ? COLORS.accent : '#999'
//             }
//           />
//           <Text
//             style={[
//               landingStyles.footerTabLabel,
//               activeTab === 'home' &&
//                 landingStyles.footerTabLabelActive,
//             ]}
//           >
//             Home
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             landingStyles.footerTab,
//             activeTab === 'contacts' &&
//               landingStyles.footerTabActive,
//           ]}
//           onPress={handleContactsPress}
//         >
//           <Ionicons
//             name={
//               activeTab === 'contacts'
//                 ? 'people'
//                 : 'people-outline'
//             }
//             size={24}
//             color={
//               activeTab === 'contacts'
//                 ? COLORS.accent
//                 : '#999'
//             }
//           />
//           <Text
//             style={[
//               landingStyles.footerTabLabel,
//               activeTab === 'contacts' &&
//                 landingStyles.footerTabLabelActive,
//             ]}
//           >
//             Contacts
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             landingStyles.footerTab,
//             activeTab === 'profile' &&
//               landingStyles.footerTabActive,
//           ]}
//           onPress={() =>
//             navigation.push('Profile', {
//               fromScreen: 'Landing',
//             })
//           }
//         >
//           <Ionicons
//             name={
//               activeTab === 'profile'
//                 ? 'person'
//                 : 'person-outline'
//             }
//             size={24}
//             color={
//               activeTab === 'profile'
//                 ? COLORS.accent
//                 : '#999'
//             }
//           />
//           <Text
//             style={[
//               landingStyles.footerTabLabel,
//               activeTab === 'profile' &&
//                 landingStyles.footerTabLabelActive,
//             ]}
//           >
//             Profile
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Modal } from 'react-native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { landingStyles } from '../../styles/screens/landingStyles';
import COLORS from '../../styles/colors';
import { getDBCUsers } from '../../utils/contacts';
import { getDashboard, clearUser } from '../../utils/storage';

export default function LandingScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [dashboardCards, setDashboardCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // 🔥 BACK BUTTON EXIT HANDLING
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Exit App",
        "Are you sure you want to exit?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() }
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    loadContacts();
    loadDashboardCards();
    const unsubscribe = navigation.addListener('focus', loadDashboardCards);
    return unsubscribe;
  }, []);

  const loadDashboardCards = async () => {
    try {
      let cards = await getDashboard();
      if (!Array.isArray(cards)) cards = [];
      setDashboardCards(cards);
    } catch (e) {
      setDashboardCards([]);
    }
  };

  const loadContacts = async () => {
    try {
      const users = await getDBCUsers();
      setContacts(users || []);
      setFilteredContacts(users || []);
    } catch (error) {
      console.log('Error loading contacts:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(
        (contact) =>
          (contact.name &&
            contact.name.toLowerCase().includes(text.toLowerCase())) ||
          (contact.designation &&
            contact.designation.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredContacts(filtered);
    }
  };

  const handleCreateCard = () => {
    navigation.navigate('PersonalDetails');
  };

  const handleHomePress = () => setActiveTab('home');
  const handleContactsPress = () => setActiveTab('contacts');
  const handleMicPress = () => setIsListening(!isListening);

  const handleLogout = async () => {
    await clearUser();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      {/* 🔥 TOP BAR */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 8,
        backgroundColor: '#fff',
        elevation: 2
      }}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 6 }}>
          <Ionicons name="menu" size={28} color={COLORS.accent} />
        </TouchableOpacity>

        <View style={{
          flex: 1,
          marginHorizontal: 10,
          backgroundColor: '#f2f2f2',
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          height: 38
        }}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={{ flex: 1, marginLeft: 6 }}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={handleMicPress}>
            <Ionicons name="mic" size={20} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.push('Profile', { fromScreen: 'Landing' })}
        >
          <Ionicons name="person-circle" size={32} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {/* 🔥 SIDE MENU */}
      <Modal visible={menuVisible} animationType="slide" transparent>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={{
            width: 260,
            height: '100%',
            backgroundColor: '#fff',
            paddingTop: 40,
            paddingHorizontal: 20,
            position: 'absolute',
            left: 0,
            top: 0,
          }}>
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginBottom: 30,
              color: COLORS.accent
            }}>
              Menu
            </Text>

            <TouchableOpacity
              style={{ marginBottom: 20 }}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Profile');
              }}
            >
              <Text style={{ fontSize: 16 }}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout}>
              <Text style={{ fontSize: 16, color: 'red' }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 🔥 CONTACTS */}
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={landingStyles.contactsListContainer}>
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={landingStyles.contactCard}
                onPress={() =>
                  navigation.navigate('SelectTemplate', { contact })
                }
              >
                <View style={landingStyles.contactInfo}>
                  <Text style={landingStyles.contactName}>
                    {contact.name || 'Unknown'}
                  </Text>
                </View>

                <View style={landingStyles.contactCategory}>
                  <Text style={landingStyles.contactCategoryText}>
                    {contact.designation ||
                      contact.companyName ||
                      'Professional'}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#999"
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={landingStyles.emptyContainer}>
              <Ionicons
                name="person-add"
                size={60}
                color={COLORS.accent}
              />
              <Text style={landingStyles.emptyText}>
                No contacts found
              </Text>

              {/* 🔥 CREATE CARD BUTTON */}
              <TouchableOpacity
                style={landingStyles.createButton}
                onPress={handleCreateCard}
              >
                <Ionicons
                  name="add-circle"
                  size={20}
                  color="#FFF"
                />
                <Text style={landingStyles.createButtonText}>
                  Create Your Card
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 🔥 FOOTER TABS */}
      <View style={landingStyles.footerTabs}>
        <TouchableOpacity
          style={[
            landingStyles.footerTab,
            activeTab === 'home' &&
              landingStyles.footerTabActive,
          ]}
          onPress={handleHomePress}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'home' ? COLORS.accent : '#999'}
          />
          <Text
            style={[
              landingStyles.footerTabLabel,
              activeTab === 'home' &&
                landingStyles.footerTabLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            landingStyles.footerTab,
            activeTab === 'contacts' &&
              landingStyles.footerTabActive,
          ]}
          onPress={handleContactsPress}
        >
          <Ionicons
            name={activeTab === 'contacts' ? 'people' : 'people-outline'}
            size={24}
            color={activeTab === 'contacts' ? COLORS.accent : '#999'}
          />
          <Text
            style={[
              landingStyles.footerTabLabel,
              activeTab === 'contacts' &&
                landingStyles.footerTabLabelActive,
            ]}
          >
            Contacts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            landingStyles.footerTab,
            activeTab === 'profile' &&
              landingStyles.footerTabActive,
          ]}
          onPress={() =>
            navigation.push('Profile', { fromScreen: 'Landing' })
          }
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? COLORS.accent : '#999'}
          />
          <Text
            style={[
              landingStyles.footerTabLabel,
              activeTab === 'profile' &&
                landingStyles.footerTabLabelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
