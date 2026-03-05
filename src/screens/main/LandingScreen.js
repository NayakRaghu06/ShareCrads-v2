import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Modal } from 'react-native';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { landingStyles } from '../../styles/screens/landingStyles';
import COLORS from '../../styles/colors';
import { getDBCUsers } from '../../utils/contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import { getDashboard } from '../../utils/storage';

// ─── Moved OUTSIDE LandingScreen — was previously defined inside render,
//     causing it to remount on every parent state change.
const InboxButton = React.memo(({ navigation }) => {
  const [unreadCount, setUnreadCount] = useState(2);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const handleInboxPress = useCallback(() => {
    navigation.navigate('InboxScreen');
    setTimeout(() => {
      if (isMounted.current) setUnreadCount(0);
    }, 500);
  }, [navigation]);

  return (
    <View style={ls.inboxWrap}>
      <TouchableOpacity
        style={[landingStyles.createButton, ls.inboxBtn]}
        onPress={handleInboxPress}
        activeOpacity={0.85}
      >
        <Ionicons name="mail-outline" size={20} color="#FFF" />
        <Text style={landingStyles.createButtonText}>Inbox</Text>
        {unreadCount > 0 && (
          <View style={ls.badge}>
            <Text style={ls.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
});

// ─── Contact row — memoized so it only re-renders when its own data changes
const ContactRow = React.memo(({ contact, onPress }) => (
  <TouchableOpacity
    style={landingStyles.contactCard}
    onPress={onPress}
  >
    <View style={landingStyles.contactInfo}>
      <Text style={landingStyles.contactName}>{contact.name || 'Unknown'}</Text>
    </View>
    <View style={landingStyles.contactCategory}>
      <Text style={landingStyles.contactCategoryText}>
        {contact.designation || contact.companyName || 'Professional'}
      </Text>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </View>
  </TouchableOpacity>
));

// ─── Saved card row — memoized
const SavedCardRow = React.memo(({ card, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    style={ls.savedCard}
  >
    <View style={ls.savedCardRow}>
      <View style={ls.savedCardLeft}>
        {card.savedImage ? (
          <Image source={{ uri: card.savedImage }} style={ls.savedCardImage} />
        ) : (
          <View style={ls.savedCardPlaceholder} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={ls.savedCardName}>{card.name || 'Unnamed'}</Text>
          <Text style={ls.savedCardDesig}>{card.designation || ''}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#999" />
    </View>
  </TouchableOpacity>
));

// ────────────────────────────────────────────────────────────────────────────
export default function LandingScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [dashboardCards, setDashboardCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [menuVisible, setMenuVisible] = useState(false);
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [, setIsListening] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // ── Back button ────────────────────────────────────────────────────────────
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };
    const handler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => handler.remove();
  }, []);

  // ── Data loading ───────────────────────────────────────────────────────────
  const loadDashboardCards = useCallback(async () => {
    try {
      let cards = await getDashboard();
      setDashboardCards(Array.isArray(cards) ? cards : []);
    } catch {
      setDashboardCards([]);
    }
  }, []);

  const loadContacts = useCallback(async () => {
    try {
      const users = await getDBCUsers();
      setContacts(users || []);
    } catch (e) {
      console.log('Error loading contacts:', e);
    }
  }, []);

  useEffect(() => {
    loadContacts();
    loadDashboardCards();
    const unsubscribe = navigation.addListener('focus', loadDashboardCards);
    return unsubscribe;
  }, [navigation, loadContacts, loadDashboardCards]);

  // ── Derived: filtered contacts (memoized — recalculates only when deps change)
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const q = searchQuery.toLowerCase();
    return contacts.filter(
      c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.designation && c.designation.toLowerCase().includes(q))
    );
  }, [contacts, searchQuery]);

  // ── Handlers (useCallback — stable references, no recreation on re-render)
  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  const handleCreateCard = useCallback(() => {
    navigation.navigate('PersonalDetails');
  }, [navigation]);

  const handleHomePress = useCallback(() => setActiveTab('home'), []);
  const handleMicPress  = useCallback(() => setIsListening(v => !v), []);

  const handleLogout = useCallback(async () => {
    try {
      await apiFetch('/user/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.log('Logout API error:', e);
    }
    await AsyncStorage.removeItem('userPhone');
    setMenuVisible(false);
    navigation.replace('Login');
  }, [navigation]);

  // ── FlatList render functions (useCallback — stable reference for FlatList)
  const renderContact = useCallback(({ item }) => (
    <ContactRow
      contact={item}
      onPress={() => navigation.navigate('SelectTemplate', { contact: item })}
    />
  ), [navigation]);

  const renderSavedCard = useCallback(({ item }) => (
    <SavedCardRow
      card={item}
      onPress={() => {
        setShowSavedCards(false);
        navigation.navigate('FinalPreview', { cardData: item });
      }}
    />
  ), [navigation]);

  const keyExtractContact  = useCallback((_, i) => String(i), []);
  const keyExtractSaved    = useCallback((_, i) => `saved-${i}`, []);

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1 }}>

      {/* TOP BAR */}
      <View style={ls.topBar}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={ls.menuBtn}>
          <Ionicons name="menu" size={28} color={COLORS.accent} />
        </TouchableOpacity>

        <View style={ls.searchBox}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={ls.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={handleMicPress}>
            <Ionicons name="mic" size={20} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.push('Profile', { fromScreen: 'Landing' })}>
          <Ionicons name="person-circle" size={32} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {/* SIDE MENU */}
      <Modal visible={menuVisible} animationType="slide" transparent>
        <TouchableOpacity
          style={ls.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={ls.sideMenu}>
            <Text style={ls.menuTitle}>Menu</Text>

            <TouchableOpacity
              style={ls.menuItem}
              onPress={() => { setMenuVisible(false); setShowComingSoon(true); }}
              activeOpacity={0.85}
            >
              <Ionicons name="settings-outline" size={22} color={COLORS.accent} style={ls.menuIcon} />
              <Text style={ls.menuItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={ls.menuItem} onPress={handleLogout} activeOpacity={0.85}>
              <Ionicons name="log-out-outline" size={22} color="red" style={ls.menuIcon} />
              <Text style={[ls.menuItemText, { color: 'red' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* SAVED CARDS MODAL */}
      <Modal visible={showSavedCards} animationType="slide" transparent>
        <View style={ls.centeredOverlay}>
          <View style={ls.savedCardsModal}>
            <View style={ls.modalHeader}>
              <Text style={ls.modalHeaderTitle}>My Saved Cards</Text>
              <TouchableOpacity onPress={() => setShowSavedCards(false)}>
                <Ionicons name="close" size={26} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
            {dashboardCards.length === 0 ? (
              <View style={ls.emptyWrap}>
                <Ionicons name="bookmark-outline" size={50} color={COLORS.accent} />
                <Text style={ls.emptyTitle}>No saved cards yet</Text>
                <Text style={ls.emptySubtitle}>Save your first digital card</Text>
              </View>
            ) : (
              <FlatList
                data={dashboardCards}
                keyExtractor={keyExtractSaved}
                renderItem={renderSavedCard}
                style={{ maxHeight: 400 }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* COMING SOON MODAL */}
      <Modal visible={showComingSoon} transparent animationType="fade">
        <View style={ls.centeredOverlay}>
          <View style={ls.comingSoonBox}>
            <Ionicons name="construct-outline" size={40} color="#D4AF37" />
            <Text style={ls.comingSoonTitle}>Feature Coming Soon</Text>
            <Text style={ls.comingSoonSub}>This feature will be available in the next update.</Text>
            <TouchableOpacity
              onPress={() => setShowComingSoon(false)}
              style={ls.comingSoonBtn}
            >
              <Text style={ls.comingSoonBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CONTACTS LIST */}
      {filteredContacts.length > 0 ? (
        <FlatList
          data={filteredContacts}
          keyExtractor={keyExtractContact}
          renderItem={renderContact}
          contentContainerStyle={landingStyles.contactsListContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={landingStyles.contactsListContainer}>
            <View style={landingStyles.emptyContainer}>
              <TouchableOpacity style={landingStyles.createButton} onPress={handleCreateCard}>
                <Ionicons name="add-circle" size={20} color="#FFF" />
                <Text style={landingStyles.createButtonText}>Create Your Card</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[landingStyles.createButton, ls.myCardsBtn]}
                onPress={() => navigation.navigate('MyCards')}
              >
                <Ionicons name="albums-outline" size={20} color="#FFF" />
                <Text style={landingStyles.createButtonText}>My Cards</Text>
              </TouchableOpacity>

              <InboxButton navigation={navigation} />
            </View>
          </View>
        </ScrollView>
      )}

      {/* FOOTER TABS */}
      <View style={landingStyles.footerTabs}>
        <TouchableOpacity
          style={[landingStyles.footerTab, activeTab === 'home' && landingStyles.footerTabActive]}
          onPress={handleHomePress}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'home' ? COLORS.accent : '#999'}
          />
          <Text style={[landingStyles.footerTabLabel, activeTab === 'home' && landingStyles.footerTabLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[landingStyles.footerTab, activeTab === 'contacts' && landingStyles.footerTabActive]}
          onPress={() => navigation.navigate('Contacts')}
        >
          <Ionicons
            name={activeTab === 'contacts' ? 'people' : 'people-outline'}
            size={24}
            color={activeTab === 'contacts' ? COLORS.accent : '#999'}
          />
          <Text style={[landingStyles.footerTabLabel, activeTab === 'contacts' && landingStyles.footerTabLabelActive]}>
            Contacts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[landingStyles.footerTab, activeTab === 'profile' && landingStyles.footerTabActive]}
          onPress={() => navigation.push('Profile', { fromScreen: 'Landing' })}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? COLORS.accent : '#999'}
          />
          <Text style={[landingStyles.footerTabLabel, activeTab === 'profile' && landingStyles.footerTabLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles for newly added/extracted elements (landing-screen specific)
const ls = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  menuBtn: { padding: 6 },
  searchBox: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: { flex: 1, marginLeft: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sideMenu: {
    width: 260,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  menuTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, color: COLORS.accent },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 18,
    backgroundColor: '#f7f7f7',
  },
  menuIcon: { marginRight: 16 },
  menuItemText: { fontSize: 16, color: '#222', fontWeight: '500' },
  centeredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedCardsModal: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  modalHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.accent },
  emptyWrap: { alignItems: 'center', paddingVertical: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  emptySubtitle: { color: '#666', marginTop: 6 },
  savedCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  savedCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  savedCardImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  savedCardPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginRight: 12,
  },
  savedCardName: { fontSize: 16, fontWeight: '700', color: '#111' },
  savedCardDesig: { fontSize: 13, color: '#666', marginTop: 4 },
  comingSoonBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  comingSoonTitle: { fontSize: 18, fontWeight: '700', marginTop: 12 },
  comingSoonSub: { textAlign: 'center', marginTop: 8, color: '#666' },
  comingSoonBtn: {
    marginTop: 18,
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  comingSoonBtnText: { color: '#fff', fontWeight: '600' },
  inboxWrap: { width: '100%', alignItems: 'center' },
  inboxBtn: { marginTop: 12, backgroundColor: '#D4AF37', position: 'relative' },
  badge: {
    position: 'absolute',
    top: 8,
    right: 30,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  myCardsBtn: { marginTop: 12, backgroundColor: COLORS.accent },
});
