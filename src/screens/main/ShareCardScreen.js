import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ScrollView,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiFetch, checkUser, shareCardInApp, shareCardWhatsApp, getUserId } from '../../utils/api';
import websocketService from '../../utils/websocketService';
import AppHeader from '../../components/common/AppHeader';

const GOLD = '#C9A227';
const GOLD_LIGHT = '#E6D7A3';
const GOLD_BG = '#FDF6E3';

export default function ShareCardScreen({ navigation, route }) {
  const cardData = route?.params?.cardData || {};

  const parsePositiveNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const extractCardIdDeep = (node) => {
    if (!node || typeof node !== 'object') return null;

    const direct =
      parsePositiveNumber(node.cardId) ??
      parsePositiveNumber(node.businessCardId) ??
      parsePositiveNumber(node.card_id) ??
      parsePositiveNumber(node.business_card_id);
    if (direct) return direct;

    if (Array.isArray(node)) {
      for (const item of node) {
        const fromItem = extractCardIdDeep(item);
        if (fromItem) return fromItem;
      }
      return null;
    }

    for (const [key, value] of Object.entries(node)) {
      // Recurse into likely card-containing branches first.
      if (key.toLowerCase().includes('card')) {
        const nested = extractCardIdDeep(value);
        if (nested) return nested;
      }
    }

    // Fallback: recurse remaining branches.
    for (const value of Object.values(node)) {
      const nested = extractCardIdDeep(value);
      if (nested) return nested;
    }

    return null;
  };

  const normalizeCardsPayload = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.cards)) return payload.cards;
    if (Array.isArray(payload?.content)) return payload.content;
    if (Array.isArray(payload?.data?.cards)) return payload.data.cards;
    if (Array.isArray(payload?.data?.content)) return payload.data.content;
    if (payload && typeof payload === 'object') return [payload];
    return [];
  };

  const looksSameCard = (a, b) => {
    const aName = String(a?.name || '').trim().toLowerCase();
    const bName = String(b?.name || '').trim().toLowerCase();
    const aPhone = String(a?.phoneNumber ?? a?.phone ?? '').replace(/\D/g, '');
    const bPhone = String(b?.phoneNumber ?? b?.phone ?? '').replace(/\D/g, '');

    const nameMatch = aName && bName && aName === bName;
    const phoneMatch = aPhone && bPhone && aPhone === bPhone;
    return nameMatch || phoneMatch;
  };

  const extractCardId = (obj) => {
    if (!obj || typeof obj !== 'object') return null;

    const explicit =
      parsePositiveNumber(route?.params?.cardId) ??
      parsePositiveNumber(obj.cardId) ??
      parsePositiveNumber(obj.id) ??
      parsePositiveNumber(obj.businessCardId) ??
      parsePositiveNumber(obj.business_card_id) ??
      parsePositiveNumber(obj.cardID) ??
      parsePositiveNumber(obj.card_id);
    if (explicit) return explicit;

    const nestedCard = obj.card || obj.businessCard || obj.cardDetails || obj.cardDto;
    if (nestedCard && typeof nestedCard === 'object') {
      const nested = extractCardId(nestedCard);
      if (nested) return nested;
    }

    return null;
  };

  const resolveCardId = async () => {
    const fromRoute = extractCardId({ ...cardData, cardId: route?.params?.cardId });
    if (fromRoute) return fromRoute;

    // Final fallback: fetch latest cards and use first valid id
    const { res, data } = await apiFetch('/api/cards/view-cards');
    if (!res.ok) {
      console.log('[Share In App] view-cards status:', res.status);
      return null;
    }

    const list = normalizeCardsPayload(data);

    if (!Array.isArray(list) || list.length === 0) {
      console.log('[Share In App] view-cards payload:', JSON.stringify(data));
      return null;
    }

    // Prefer the id of the same card being shared, otherwise first valid id.
    let fromApi = null;
    for (const item of list) {
      if (looksSameCard(item, cardData)) {
        fromApi = extractCardId(item) || extractCardIdDeep(item);
        if (fromApi) break;
      }
    }

    if (!fromApi) {
      for (const item of list) {
        fromApi = extractCardId(item) || extractCardIdDeep(item);
        if (fromApi) break;
      }
    }

    if (fromApi) return fromApi;

    console.log('[Share In App] unable to extract cardId from list payload');
    return null;
  };

  const [mobile, setMobile] = useState('');
  const [userStatus, setUserStatus] = useState('none'); // "none" | "found" | "notfound"
  const [foundUser, setFoundUser] = useState(null);
  const [checking, setChecking] = useState(false);

  const APP_LINK = 'https://sharecards.in';
  const inviteMessage =
    `Hey! I'm using Digital Business Card (DBC) to share my professional profile instantly.\nCreate your card and connect with me here:\n${APP_LINK}`;

  // GET /api/share/check-user?mobileNumber=...
  const handleCheckUser = async () => {
    const receiverMobile = String(mobile || '').trim();
    if (!/^[0-9]{10}$/.test(receiverMobile)) {
      Alert.alert('Invalid Number', 'Please enter a valid 10 digit mobile number.');
      return;
    }

    setChecking(true);
    try {
      const { res, data } = await checkUser(receiverMobile);
      if (res.status === 401) { navigation.replace('Login'); return; }

      const exists = Boolean(data?.exists ?? data?.data?.exists);
      if (res.ok && exists) {
        setFoundUser(data?.data || data);
        setUserStatus('found');
      } else {
        setFoundUser(null);
        setUserStatus('notfound');
      }
    } catch {
      Alert.alert('Error', 'Failed to check user');
    } finally {
      setChecking(false);
    }
  };

  // POST /api/share — in-app share
  const handleShareInApp = async () => {
    try {
      const senderIdRaw = await getUserId();
      const receiverMobileRaw = String(mobile || '').trim();

      const senderId = Number(senderIdRaw);
      const receiverMobile = Number(receiverMobileRaw);
      const cardId = await resolveCardId();

      console.log('[Share In App] senderId:', senderIdRaw);
      console.log('[Share In App] receiverMobile:', receiverMobileRaw);
      console.log('[Share In App] backendResolvedCardId:', cardId);

      if (!senderIdRaw || !Number.isFinite(senderId) || senderId <= 0) {
        navigation.replace('Login');
        return;
      }
      if (!Number.isFinite(receiverMobile) || receiverMobileRaw.length !== 10) {
        Alert.alert('Invalid Number', 'Please enter a valid 10 digit mobile number.');
        return;
      }
      if (!Number.isFinite(cardId) || cardId <= 0) {
        Alert.alert('Error', 'Card ID is missing. Please try again.');
        return;
      }

      const { res, data } = await shareCardInApp(senderId, receiverMobile, cardId);
      if (res.status === 401) { navigation.replace('Login'); return; }

      if (res.ok) {
        // Publish to STOMP destination: /app/share-card
        const receiverId = foundUser?.userId || foundUser?.id;
        if (receiverId) {
          await websocketService.connect(senderIdRaw);
          websocketService.sendShareCard({
            senderId,
            receiverId: Number(receiverId),
            card: cardData,
          });
        }
        Alert.alert('Shared!', 'Card shared successfully.');
      } else {
        Alert.alert('Error', data?.message || 'Failed to share card');
      }
    } catch {
      Alert.alert('Error', 'Failed to share card');
    }
  };

  // POST /api/share/whatsapp — get WhatsApp URL then open it
  const handleShareWhatsApp = async () => {
    try {
      const senderIdRaw = await getUserId();
      const receiverMobileRaw = String(mobile || '').trim();

      const senderId = Number(senderIdRaw);
      const receiverMobile = Number(receiverMobileRaw);
      const cardId = await resolveCardId();

      console.log('[Share WhatsApp] senderId:', senderIdRaw);
      console.log('[Share WhatsApp] receiverMobile:', receiverMobileRaw);
      console.log('[Share WhatsApp] backendResolvedCardId:', cardId);

      if (!senderIdRaw || !Number.isFinite(senderId) || senderId <= 0) {
        navigation.replace('Login');
        return;
      }
      if (!Number.isFinite(receiverMobile) || receiverMobileRaw.length !== 10) {
        Alert.alert('Invalid Number', 'Please enter a valid 10 digit mobile number.');
        return;
      }
      if (!Number.isFinite(cardId) || cardId <= 0) {
        Alert.alert('Error', 'Card ID is missing. Please try again.');
        return;
      }

      const { res, data } = await shareCardWhatsApp(senderId, receiverMobile, cardId);
      if (res.status === 401) { navigation.replace('Login'); return; }
      const url = data?.whatsappUrl || data?.whatsappLink;
      if (url) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Could not get WhatsApp link');
      }
    } catch {
      Alert.alert('Unable to open WhatsApp');
    }
  };

  // INVITE via system share sheet
  const handleInviteShare = async () => {
    try {
      await Share.share({ message: inviteMessage });
    } catch {
      Alert.alert('Error', 'Unable to open share sheet.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Input Section ── */}
        <Text style={styles.label}>Enter Mobile Number</Text>

        <View style={styles.inputWrapper}>
          <View style={styles.countryBox}>
            <Text style={styles.countryText}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="10 digit mobile number"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            maxLength={10}
            value={mobile}
            onChangeText={(t) => { setMobile(t); setUserStatus('none'); setFoundUser(null); }}
          />
        </View>

        {/* ── Check User Button ── */}
        <TouchableOpacity style={styles.checkBtn} onPress={handleCheckUser} activeOpacity={0.85} disabled={checking}>
          <Text style={styles.checkBtnText}>{checking ? 'Checking...' : 'Check User'}</Text>
        </TouchableOpacity>

        {/* ── USER FOUND ── */}
        {userStatus === 'found' && (
          <>
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={styles.successText}>  User Found!</Text>
            </View>

            <View style={styles.userCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetter}>
                  {foundUser?.firstName?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {foundUser?.firstName} {foundUser?.lastName}
                </Text>
              </View>
            </View>

            <View style={styles.shareTitleRow}>
              <View style={styles.divider} />
              <Text style={styles.shareTitle}>Choose Share Option:</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.shareInAppBtn} onPress={handleShareInApp} activeOpacity={0.85}>
              <Ionicons name="phone-portrait-outline" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>  Share In App</Text>
            </TouchableOpacity>

          </>
        )}

        {/* ── USER NOT FOUND ── */}
        {userStatus === 'notfound' && (
          <>
            <View style={styles.errorCard}>
              <Ionicons name="close-circle" size={22} color="#DC2626" />
              <Text style={styles.errorText}>  User Not Found</Text>
            </View>

            <Text style={styles.errorDesc}>
              This number is not registered on DBC.{'\n\n'}
              Invite them to join and share your digital card instantly.
            </Text>

            <TouchableOpacity style={styles.inviteWhatsappBtn} onPress={handleShareWhatsApp} activeOpacity={0.85}>
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>  Share on WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inviteBtn}
              onPress={handleInviteShare}
              activeOpacity={0.85}
            >
              <Ionicons name="share-social-outline" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>  Share Invitation</Text>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* ── Scroll ── */
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  /* ── Input ── */
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: GOLD_LIGHT,
    marginBottom: 16,
    overflow: 'hidden',
  },
  countryBox: {
    backgroundColor: GOLD_BG,
    paddingHorizontal: 14,
    paddingVertical: 15,
    borderRightWidth: 1,
    borderRightColor: GOLD_LIGHT,
  },
  countryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 15,
    fontSize: 16,
    color: '#111',
  },

  /* ── Check User Button ── */
  checkBtn: {
    backgroundColor: GOLD,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: GOLD,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  checkBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  /* ── User Found Banner ── */
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  successText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  /* ── User Card ── */
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: GOLD_LIGHT,
    shadowColor: GOLD,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  userDesignation: {
    fontSize: 13,
    color: GOLD,
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 13,
    color: '#666',
  },

  /* ── Share Option Divider ── */
  shareTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 14,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: GOLD_LIGHT,
  },
  shareTitle: {
    marginHorizontal: 10,
    fontWeight: '600',
    color: '#555',
    fontSize: 13,
  },

  /* ── Share Buttons ── */
  shareInAppBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GOLD,
    height: 50,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: GOLD,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  shareBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  /* ── User Not Found Banner ── */
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 15,
  },

  /* ── Error Description ── */
  errorDesc: {
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 4,
    color: '#555',
    fontSize: 14,
    lineHeight: 22,
  },

  /* ── Invite WhatsApp Button ── */
  inviteWhatsappBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25D366',
    height: 50,
    borderRadius: 12,
    marginTop: 16,
    elevation: 3,
  },

  /* ── Invite Share Button ── */
  inviteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GOLD,
    height: 50,
    borderRadius: 12,
    marginTop: 12,
    elevation: 3,
    shadowColor: GOLD,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
