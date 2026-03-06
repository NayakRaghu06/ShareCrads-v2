import { useState, useEffect } from 'react';
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
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import socket from '../../utils/socket';
import AppHeader from '../../components/common/AppHeader';

const GOLD = '#C9A227';
const GOLD_LIGHT = '#E6D7A3';
const GOLD_BG = '#FDF6E3';

// ── Finds the first numeric ID field in any object regardless of field name ──
// Checks known variants first, then scans all keys for anything ending in "id".
function extractId(obj) {
  if (!obj || typeof obj !== 'object') return null;
  // known common variants (camelCase and snake_case)
  const known = obj.cardId ?? obj.card_id ?? obj.id ?? obj.cardID ?? obj.CardId;
  if (known != null && !isNaN(Number(known))) return Number(known);
  // scan all keys — find first numeric field whose name ends with "id" (case-insensitive)
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase().endsWith('id') && obj[key] != null && !isNaN(Number(obj[key]))) {
      return Number(obj[key]);
    }
  }
  return null;
}

export default function ShareCardScreen({ navigation, route }) {
  const { cardData } = route.params;

  const [mobileNumber, setMobileNumber] = useState('');
  const [userFound, setUserFound]       = useState(null); // null | true | false
  const [userData, setUserData]         = useState(null);
  const [loading, setLoading]           = useState(false);

  // ── Resolve cardId — layer 1: route.params ─────────────────────────────────
  const [cardId, setCardId] = useState(() => extractId(cardData));

  useEffect(() => {
    // Log what the backend actually sent so we can see the real field name
    console.log('[ShareCardScreen] cardData received:', JSON.stringify(cardData));
    console.log('[ShareCardScreen] resolved cardId (layer 1):', extractId(cardData));
  }, []);

  useEffect(() => {
    if (cardId) return; // layer 1 already resolved — skip

    (async () => {
      try {
        // Layer 2: AsyncStorage 'activeCardId'
        const stored = await AsyncStorage.getItem('activeCardId');
        console.log('[ShareCardScreen] activeCardId from storage:', stored);
        if (stored && !isNaN(Number(stored))) {
          setCardId(Number(stored));
          return;
        }

        // Layer 3: fetch card list from API — use smart extractor on first result
        const { res, data } = await apiFetch('/api/cards/view-cards');
        console.log('[ShareCardScreen] view-cards response:', JSON.stringify(data));
        if (res.ok && Array.isArray(data) && data.length > 0) {
          const id = extractId(data[0]);
          console.log('[ShareCardScreen] resolved cardId (layer 3):', id);
          if (id) setCardId(id);
        }
      } catch (e) {
        console.warn('[ShareCardScreen] cardId fallback failed:', e);
      }
    })();
  }, [cardId]);

  const APP_LINK = 'https://sharecards.in';
  const inviteMessage =
    `Hey! I'm using Digital Business Card (DBC) to share my professional profile instantly.\nCreate your card and connect with me here:\n${APP_LINK}`;

  // ── GET /api/share/check-user ──────────────────────────────────────────────
  const handleCheckUser = async () => {
    setLoading(true);
    try {
      const { res, data } = await apiFetch(
        `/api/share/check-user?mobileNumber=${mobileNumber}`
      );
      if (res.status === 401) { navigation.replace('Login'); return; }

      if (res.ok && data?.exists) {
        setUserData(data);
        setUserFound(true);
      } else {
        setUserData(null);
        setUserFound(false);
      }
    } catch {
      Alert.alert('Error', 'Failed to check user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── POST /api/share ────────────────────────────────────────────────────────
  const handleShareInApp = async () => {
    try {
      const senderId = await AsyncStorage.getItem('loggedInUserId');
      if (!senderId) { navigation.replace('Login'); return; }
      if (!cardId) { Alert.alert('Error', 'Card ID is missing. Please try again.'); return; }

      const payload = {
        senderId: Number(senderId),
        receiverMobile: Number(mobileNumber),
        cardId: Number(cardId),
      };

      // Debug — visible in Metro logs
      console.log('[ShareInApp] payload:', JSON.stringify(payload));

      const { res, data } = await apiFetch('/api/share', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log('[ShareInApp] status:', res.status, '| response:', JSON.stringify(data));

      if (res.status === 401) { navigation.replace('Login'); return; }

      if (res.ok) {
        const receiverId = userData?.userId ?? userData?.id;
        if (receiverId) {
          socket.emit('shareCard', {
            senderId: Number(senderId),
            receiverId: Number(receiverId),
            card: cardData,
          });
        }
        Alert.alert('Shared!', 'Card shared successfully.');
      } else {
        // Show exactly what the backend says so we can diagnose
        const msg = data?.message || data?.error || `Server error ${res.status}`;
        console.warn('[ShareInApp] backend error:', msg);
        Alert.alert('Error', msg);
      }
    } catch (e) {
      console.warn('[ShareInApp] catch:', e);
      Alert.alert('Error', 'Failed to share card.');
    }
  };

  // ── POST /api/share/whatsapp ───────────────────────────────────────────────
  const handleShareWhatsApp = async () => {
    // If user is not on the app, fall back to an invite message
    if (!userFound) {
      const url = `https://wa.me/91${mobileNumber}?text=${encodeURIComponent(inviteMessage)}`;
      try {
        await Linking.openURL(url);
      } catch {
        Alert.alert('WhatsApp Not Found', 'Could not open WhatsApp.');
      }
      return;
    }

    try {
      const senderId = await AsyncStorage.getItem('loggedInUserId');
      if (!senderId) { navigation.replace('Login'); return; }
      if (!cardId) { Alert.alert('Error', 'Card ID is missing. Please try again.'); return; }

      const { res, data } = await apiFetch('/api/share/whatsapp', {
        method: 'POST',
        body: JSON.stringify({
          senderId: Number(senderId),
          receiverMobile: Number(mobileNumber),
          cardId: Number(cardId),
        }),
      });

      if (res.status === 401) { navigation.replace('Login'); return; }

      const url = data?.whatsappUrl;
      if (url) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Could not get WhatsApp link.');
      }
    } catch {
      Alert.alert('Error', 'Unable to open WhatsApp.');
    }
  };

  // ── Share invite via system share sheet ───────────────────────────────────
  const handleInviteShare = async () => {
    try {
      await Share.share({ message: inviteMessage });
    } catch {
      Alert.alert('Error', 'Unable to open share sheet.');
    }
  };

  const isValidMobile = mobileNumber.length === 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── SECTION 1: Mobile Input ── */}
        <Text style={styles.sectionLabel}>Enter Mobile Number</Text>

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
            value={mobileNumber}
            onChangeText={(t) => {
              setMobileNumber(t);
              setUserFound(null);
              setUserData(null);
            }}
          />
        </View>

        <TouchableOpacity
          style={[styles.checkBtn, (!isValidMobile || loading) && styles.checkBtnDisabled]}
          onPress={handleCheckUser}
          activeOpacity={0.85}
          disabled={!isValidMobile || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.checkBtnText}>Check User</Text>
          )}
        </TouchableOpacity>

        {/* ── SECTION 2: User Found / Not Found Status ── */}
        {userFound === true && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.successBannerText}>  User Found!</Text>
          </View>
        )}

        {userFound === false && (
          <View style={styles.errorBanner}>
            <Ionicons name="close-circle" size={20} color="#DC2626" />
            <Text style={styles.errorBannerText}>  User not registered in ShareCards</Text>
          </View>
        )}

        {/* ── SECTION 3: User Preview Card ── */}
        {userFound === true && userData && (
          <View style={styles.userCard}>
            {/* Profile Photo */}
            {userData.profilePhoto ? (
              <Image
                source={{ uri: userData.profilePhoto }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>?</Text>
              </View>
            )}

            {/* User Info */}
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {userData.name || `${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim() || 'Unknown'}
              </Text>
              {userData.email ? (
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={13} color={GOLD} />
                  <Text style={styles.infoText} numberOfLines={1}>{userData.email}</Text>
                </View>
              ) : null}
              {userData.mobileNumber ? (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={13} color={GOLD} />
                  <Text style={styles.infoText}>{userData.mobileNumber}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* ── SECTION 4 & 5: Share Options ── */}
        {userFound !== null && (
          <>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>Choose Share Option</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Share In App — enabled only when user exists */}
            <TouchableOpacity
              style={[styles.shareBtn, styles.shareBtnGold, !userFound && styles.shareBtnDisabled]}
              onPress={handleShareInApp}
              activeOpacity={0.85}
              disabled={!userFound}
            >
              <Ionicons name="phone-portrait-outline" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>  Share In App</Text>
            </TouchableOpacity>

            {/* Share on WhatsApp — always enabled; invite flow when user not found */}
            <TouchableOpacity
              style={[styles.shareBtn, styles.shareBtnWhatsApp]}
              onPress={handleShareWhatsApp}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>
                {userFound ? '  Share on WhatsApp' : '  Invite on WhatsApp'}
              </Text>
            </TouchableOpacity>

            {/* Extra invite option when user not found */}
            {userFound === false && (
              <TouchableOpacity
                style={[styles.shareBtn, styles.shareBtnOutline]}
                onPress={handleInviteShare}
                activeOpacity={0.85}
              >
                <Ionicons name="share-social-outline" size={20} color={GOLD} />
                <Text style={[styles.shareBtnText, { color: GOLD }]}>  Share Invitation</Text>
              </TouchableOpacity>
            )}
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

  // ── Scroll
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },

  // ── Section Label
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },

  // ── Mobile Input
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

  // ── Check User Button
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
  checkBtnDisabled: {
    backgroundColor: '#D4C07A',
    elevation: 0,
    shadowOpacity: 0,
  },
  checkBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  // ── Status Banners
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  successBannerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  errorBanner: {
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
  errorBannerText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },

  // ── User Preview Card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: GOLD_LIGHT,
    shadowColor: GOLD,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    borderWidth: 2,
    borderColor: GOLD_LIGHT,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: GOLD_BG,
    borderWidth: 2,
    borderColor: GOLD_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarPlaceholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: GOLD,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 5,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },

  // ── Divider row
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: GOLD_LIGHT,
  },
  dividerLabel: {
    marginHorizontal: 10,
    fontWeight: '600',
    color: '#555',
    fontSize: 13,
  },

  // ── Share Buttons
  shareBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  shareBtnGold: {
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  shareBtnWhatsApp: {
    backgroundColor: '#25D366',
    shadowColor: '#25D366',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  shareBtnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: GOLD_LIGHT,
    elevation: 0,
    shadowOpacity: 0,
  },
  shareBtnDisabled: {
    backgroundColor: '#D4C07A',
    elevation: 0,
    shadowOpacity: 0,
  },
  shareBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
