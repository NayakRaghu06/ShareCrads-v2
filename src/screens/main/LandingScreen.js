
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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { landingStyles } from '../../styles/screens/landingStyles';
import COLORS from '../../styles/colors';
import { getDBCUsers } from '../../utils/contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import { getDashboard, clearUser, saveDashboard, removeDashboardCard } from '../../utils/storage';

export default function LandingScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [dashboardCards, setDashboardCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [menuVisible, setMenuVisible] = useState(false);
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

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

  const handleDeleteCard = (index) => {
    Alert.alert(
      'Delete Card',
      'Remove this saved card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const cards = await removeDashboardCard(index);
              setDashboardCards(Array.isArray(cards) ? cards : []);
            } catch (e) {
              console.warn('Failed to delete card', e);
            }
          },
        },
      ]
    );
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
  // Removed old handleContactsPress, now handled inline in footer
  const handleMicPress = () => setIsListening(!isListening);

  const handleLogout = async () => {
    try {
      // Call backend logout
      await apiFetch('/user/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.log('Logout API error:', error);
    }
    // Clear only session data
    await AsyncStorage.removeItem('userPhone');
    // Close menu
    setMenuVisible(false);
    // Navigate to Login
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
            justifyContent: 'flex-start',
          }}>
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginBottom: 30,
              color: COLORS.accent
            }}>
              Menu
            </Text>

      {/* Modal for Saved Cards */}
      <Modal visible={showSavedCards} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '90%', maxHeight: '80%', backgroundColor: '#fff', borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.accent }}>My Saved Cards</Text>
              <TouchableOpacity onPress={() => setShowSavedCards(false)}>
                <Ionicons name="close" size={26} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
            {Array.isArray(dashboardCards) && dashboardCards.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Ionicons name="bookmark-outline" size={50} color={COLORS.accent} />
                <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 12 }}>No saved cards yet</Text>
                <Text style={{ color: '#666', marginTop: 6 }}>Save your first digital card</Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 400 }}>
                {(dashboardCards || []).map((card, idx) => (
                  <TouchableOpacity
                    key={`modal-saved-${idx}`}
                    activeOpacity={0.9}
                    onPress={() => {
                      setShowSavedCards(false);
                      navigation.navigate('FinalPreview', { cardData: card });
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 12,
                      elevation: 2,
                      shadowColor: '#000',
                      shadowOpacity: 0.06,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 1 },
                      position: 'relative',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        {card.savedImage ? (
                          <Image source={{ uri: card.savedImage }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }} />
                        ) : (
                          <View style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#f2f2f2', marginRight: 12 }} />
                        )}
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>{card.name || 'Unnamed'}</Text>
                          <Text style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{card.designation || ''}</Text>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={22} color="#999" />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

            {/* Settings */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 48,
                paddingHorizontal: 10,
                borderRadius: 10,
                marginBottom: 18,
                backgroundColor: '#f7f7f7',
              }}
              onPress={() => {
                setMenuVisible(false);
                setShowComingSoon(true);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="settings-outline" size={22} color={COLORS.accent} style={{ marginRight: 16 }} />
              <Text style={{ fontSize: 16, color: '#222', fontWeight: '500' }}>Settings</Text>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 48,
                paddingHorizontal: 10,
                borderRadius: 10,
                backgroundColor: '#f7f7f7',
              }}
              onPress={handleLogout}
              activeOpacity={0.85}
            >
              <Ionicons name="log-out-outline" size={22} color={'red'} style={{ marginRight: 16 }} />
              <Text style={{ fontSize: 16, color: 'red', fontWeight: '500' }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Coming Soon Modal */}
      <Modal visible={showComingSoon} transparent animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)'
        }}>
          <View style={{
            width: '80%',
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            alignItems: 'center'
          }}>
            <Ionicons name="construct-outline" size={40} color="#D4AF37" />
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              marginTop: 12
            }}>
              Feature Coming Soon
            </Text>
            <Text style={{
              textAlign: 'center',
              marginTop: 8,
              color: '#666'
            }}>
              This feature will be available in the next update.
            </Text>
            <TouchableOpacity
              onPress={() => setShowComingSoon(false)}
              style={{
                marginTop: 18,
                backgroundColor: '#D4AF37',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 8
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🔥 CONTACTS */}
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>

        {/* My Saved Cards Dashboard */}
        {/* <View style={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 10 }}>
            My Saved Cards
          </Text>

          {Array.isArray(dashboardCards) && dashboardCards.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Ionicons name="bookmark-outline" size={50} color={COLORS.accent} />
              <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 12 }}>No saved cards yet</Text>
              <Text style={{ color: '#666', marginTop: 6 }}>Save your first digital card</Text>
            </View>
          ) : (
                (dashboardCards || []).map((card, idx) => (
              <TouchableOpacity
                key={`saved-${idx}`}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('FinalPreview', { cardData: card })}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  position: 'relative'
                }}
              >
                <TouchableOpacity
                  onPress={() => handleDeleteCard(idx)}
                  style={{ position: 'absolute', right: 10, top: 10, zIndex: 10 }}
                >
                  <Ionicons name="trash-outline" size={18} color="#b71c1c" />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {card.savedImage ? (
                      <Image source={{ uri: card.savedImage }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }} />
                    ) : (
                      <View style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#f2f2f2', marginRight: 12 }} />
                    )}

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>{card.name || 'Unnamed'}</Text>
                      <Text style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{card.designation || ''}</Text>
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={22} color="#999" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View> */}

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
              {/* <Ionicons
                name="person-add"
                size={60}
                color={COLORS.accent}
              /> */}
              {/* <Text style={landingStyles.emptyText}>
                No contacts found
              </Text> */}

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

              {/* MY CARDS BUTTON */}
              <TouchableOpacity
                style={[landingStyles.createButton, { marginTop: 12, backgroundColor: COLORS.accent }]}
                onPress={() => navigation.navigate('MyCards')}
              >
                <Ionicons
                  name="albums-outline"
                  size={20}
                  color="#FFF"
                />
                <Text style={landingStyles.createButtonText}>
                  My Cards
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
          onPress={() => {
            navigation.navigate('Contacts');
          }}
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
