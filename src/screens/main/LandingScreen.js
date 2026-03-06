import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Modal, Animated, Dimensions, PanResponder } from 'react-native';
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

const { width: SW, height: SH } = Dimensions.get('window');
const CARD_W = SW * 0.86;
const CARD_H = SH * 0.30;

// ─── Premium 3D floating card — float animation (native driver) +
//     tilt via PanResponder (JS driver, separate Animated.View layer)
const FloatingCard = React.memo(() => {
  // Native-driver: smooth float loop
  const floatAnim = useRef(new Animated.Value(0)).current;
  // JS-driver: tilt + scale (driven by PanResponder, must stay on JS)
  const tiltX   = useRef(new Animated.Value(0)).current;
  const tiltY   = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -14, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,   duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [floatAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,

      onPanResponderGrant: () => {
        Animated.spring(scaleAnim, {
          toValue: 1.06, useNativeDriver: false, tension: 60, friction: 6,
        }).start();
      },

      onPanResponderMove: (_, gs) => {
        // map finger drag → tilt degrees (clamped internally via interpolate)
        tiltY.setValue(gs.dx / 7);
        tiltX.setValue(-gs.dy / 7);
      },

      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(tiltX,    { toValue: 0, useNativeDriver: false, tension: 50, friction: 6 }),
          Animated.spring(tiltY,    { toValue: 0, useNativeDriver: false, tension: 50, friction: 6 }),
          Animated.spring(scaleAnim,{ toValue: 1, useNativeDriver: false, tension: 50, friction: 6 }),
        ]).start();
      },
    })
  ).current;

  const rotateX = tiltX.interpolate({ inputRange: [-18, 18], outputRange: ['-18deg', '18deg'], extrapolate: 'clamp' });
  const rotateY = tiltY.interpolate({ inputRange: [-18, 18], outputRange: ['-18deg', '18deg'], extrapolate: 'clamp' });

  // Shadow shrinks + fades as card rises
  const shadowOpacity = floatAnim.interpolate({ inputRange: [-14, 0], outputRange: [0.10, 0.28], extrapolate: 'clamp' });
  const shadowScaleX  = floatAnim.interpolate({ inputRange: [-14, 0], outputRange: [0.80, 1.05], extrapolate: 'clamp' });

  return (
    <View style={{ alignItems: 'center', marginBottom: 28 }}>
      {/* Layer 1 (JS): perspective + tilt + scale — MUST be separate from native layer */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [
            { perspective: 900 },
            { rotateX },
            { rotateY },
            { scale: scaleAnim },
          ],
        }}
      >
        {/* Layer 2 (native): vertical float */}
        <Animated.View style={[fc.card, { transform: [{ translateY: floatAnim }] }]}>
          <View style={[fc.corner, fc.cornerTL]} />
          <View style={[fc.corner, fc.cornerTR]} />

          <View style={fc.avatar}>
            <Ionicons name="person" size={30} color="#D4AF37" />
          </View>

          <View style={fc.nameLine} />
          <View style={fc.roleLine} />
          <View style={fc.divider} />

          <View style={fc.infoRow}>
            <Ionicons name="call-outline" size={16} color="#D4AF37" />
            <View style={fc.infoBar} />
          </View>
          <View style={fc.infoRow}>
            <Ionicons name="mail-outline" size={16} color="#D4AF37" />
            <View style={[fc.infoBar, { width: '60%' }]} />
          </View>
          <View style={fc.infoRow}>
            <Ionicons name="location-outline" size={16} color="#D4AF37" />
            <View style={[fc.infoBar, { width: '45%' }]} />
          </View>

          <View style={[fc.corner, fc.cornerBL]} />
          <View style={[fc.corner, fc.cornerBR]} />
        </Animated.View>
      </Animated.View>

      {/* Soft shadow ellipse — synced to float height */}
      <Animated.View
        style={[fc.shadowEllipse, {
          opacity: shadowOpacity,
          transform: [{ scaleX: shadowScaleX }],
        }]}
      />
    </View>
  );
});

const fc = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_H,
    backgroundColor: '#0B0E1E',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    shadowColor: '#C9A227',
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 14,
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
    opacity: 0.9,
  },
  cornerTL: { top: 12, left: 12 },
  cornerTR: { top: 12, right: 12 },
  cornerBL: { bottom: 12, left: 12 },
  cornerBR: { bottom: 12, right: 12 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1A1F35',
    borderWidth: 2.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nameLine: {
    width: CARD_W * 0.52,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4AF37',
    opacity: 0.9,
    marginBottom: 7,
  },
  roleLine: {
    width: CARD_W * 0.36,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.22,
    marginBottom: 12,
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.25,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    width: '90%',
  },
  infoBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.18,
  },
  shadowEllipse: {
    width: CARD_W * 0.65,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#C9A227',
    marginTop: 2,
  },
});
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { landingStyles } from '../../styles/screens/landingStyles';
import COLORS from '../../styles/colors';
import { getDBCUsers } from '../../utils/contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import { getDashboard } from '../../utils/storage';
import AnimatedPressable from '../../components/common/AnimatedPressable';

// ─── Moved OUTSIDE LandingScreen — was previously defined inside render,
//     causing it to remount on every parent state change.
const InboxButton = React.memo(({ navigation }) => {
  const [unreadCount, setUnreadCount] = useState(2);
  const isMounted = useRef(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  // Pulse the badge while there are unread messages
  useEffect(() => {
    if (unreadCount > 0) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.spring(pulseAnim, { toValue: 1.3, useNativeDriver: true, speed: 18, bounciness: 10 }),
          Animated.spring(pulseAnim, { toValue: 1,   useNativeDriver: true, speed: 18, bounciness: 6  }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [unreadCount]);

  const handleInboxPress = useCallback(() => {
    navigation.navigate('InboxScreen');
    setTimeout(() => {
      if (isMounted.current) setUnreadCount(0);
    }, 500);
  }, [navigation]);

  return (
    <View style={ls.inboxWrap}>
      <AnimatedPressable
        style={landingStyles.secondaryButton}
        onPress={handleInboxPress}
      >
        <Ionicons name="mail-outline" size={20} color={COLORS.accent} />
        <Text style={landingStyles.secondaryButtonText}>Inbox</Text>
        {unreadCount > 0 && (
          <Animated.View style={[ls.badge, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={ls.badgeText}>{unreadCount}</Text>
          </Animated.View>
        )}
      </AnimatedPressable>
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
          <View style={ls.savedCardPlaceholder}>
            <Ionicons name="card-outline" size={24} color={COLORS.accent} />
          </View>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>

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
              <FloatingCard />
              {/* <Text style={landingStyles.emptyTitle}>No Contacts Yet</Text> */}
              <Text style={landingStyles.emptySubtitle}>
                Create your digital business card and start sharing with the world
              </Text>

              <AnimatedPressable style={landingStyles.createButton} onPress={handleCreateCard}>
                <Ionicons name="add-circle" size={20} color="#FFF" />
                <Text style={landingStyles.createButtonText}>Create Your Card</Text>
              </AnimatedPressable>

              <AnimatedPressable
                style={landingStyles.secondaryButton}
                onPress={() => navigation.navigate('MyCards')}
              >
                <Ionicons name="albums-outline" size={20} color={COLORS.accent} />
                <Text style={landingStyles.secondaryButtonText}>My Cards</Text>
              </AnimatedPressable>

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
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  menuBtn: { padding: 6 },
  searchBox: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  searchInput: { flex: 1, marginLeft: 6, fontSize: 14, color: COLORS.text },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sideMenu: {
    width: 270,
    height: '100%',
    backgroundColor: COLORS.surface,
    paddingTop: 48,
    paddingHorizontal: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 4, height: 0 },
  },
  menuTitle: { fontSize: 22, fontWeight: '800', marginBottom: 28, color: COLORS.accent },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: COLORS.surfaceAlt,
  },
  menuIcon: { marginRight: 14 },
  menuItemText: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  centeredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedCardsModal: {
    width: '92%',
    maxHeight: '80%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalHeaderTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  emptyWrap: { alignItems: 'center', paddingVertical: 28 },
  emptyTitle: { fontSize: 15, fontWeight: '600', marginTop: 12, color: COLORS.text },
  emptySubtitle: { color: COLORS.textSecondary, marginTop: 6, fontSize: 13 },
  savedCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  savedCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  savedCardImage: { width: 52, height: 52, borderRadius: 10, marginRight: 12 },
  savedCardPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.accentLight,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedCardName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  savedCardDesig: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  comingSoonBox: {
    width: '82%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    elevation: 8,
  },
  comingSoonTitle: { fontSize: 18, fontWeight: '700', marginTop: 14, color: COLORS.text },
  comingSoonSub: { textAlign: 'center', marginTop: 8, color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
  comingSoonBtn: {
    marginTop: 20,
    backgroundColor: COLORS.accent,
    paddingVertical: 11,
    paddingHorizontal: 36,
    borderRadius: 12,
  },
  comingSoonBtnText: { color: COLORS.surface, fontWeight: '700', fontSize: 14 },
  inboxWrap: { width: '100%', alignItems: 'center', marginTop: 8 },
  inboxBtn: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: 8,
    right: 30,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  badgeText: { color: COLORS.surface, fontWeight: 'bold', fontSize: 11 },
  myCardsBtn: { marginTop: 12, backgroundColor: COLORS.accent },
});
