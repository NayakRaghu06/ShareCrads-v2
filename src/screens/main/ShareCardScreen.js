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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import socket from '../../utils/socket';
import AppHeader from '../../components/common/AppHeader';

const GOLD = '#C9A227';
const GOLD_LIGHT = '#E6D7A3';
const GOLD_BG = '#FDF6E3';

export default function ShareCardScreen({ navigation, route }) {
  const { cardData } = route.params;

  const [mobile, setMobile] = useState('');
  const [userStatus, setUserStatus] = useState('none'); // "none" | "found" | "notfound"
  const [foundUser, setFoundUser] = useState(null);
  const [checking, setChecking] = useState(false);

  const APP_LINK = 'https://sharecards.in';
  const inviteMessage =
    `Hey! I'm using Digital Business Card (DBC) to share my professional profile instantly.\nCreate your card and connect with me here:\n${APP_LINK}`;

  // GET /api/share/check-user?mobileNumber=...
  const handleCheckUser = async () => {
    if (mobile.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10 digit mobile number.');
      return;
    }
    setChecking(true);
    try {
      const { res, data } = await apiFetch(`/api/share/check-user?mobileNumber=${mobile}`);
      if (res.status === 401) { navigation.replace('Login'); return; }
      if (res.ok && data?.exists) {
        setFoundUser(data);
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
      const senderId = await AsyncStorage.getItem('loggedInUserId');
      if (!senderId) { navigation.replace('Login'); return; }
      // POST /api/share
      const { res, data } = await apiFetch('/api/share', {
        method: 'POST',
        body: JSON.stringify({
          senderId: Number(senderId),
          receiverMobile: Number(mobile),
          cardId: Number(cardData.cardId),
        }),
      });
      if (res.status === 401) { navigation.replace('Login'); return; }
      if (res.ok) {
        // Emit real-time socket event so receiver gets instant notification
        const receiverId = foundUser?.userId || foundUser?.id;
        if (receiverId) {
          socket.emit('shareCard', {
            senderId: Number(senderId),
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
  const handleWhatsApp = async () => {
    try {
      const senderId = await AsyncStorage.getItem('loggedInUserId');
      if (!senderId) { navigation.replace('Login'); return; }
      // POST /api/share/whatsapp
      const { res, data } = await apiFetch('/api/share/whatsapp', {
        method: 'POST',
        body: JSON.stringify({
          senderId: Number(senderId),
          receiverMobile: Number(mobile),
          cardId: Number(cardData.cardId),
        }),
      });
      if (res.status === 401) { navigation.replace('Login'); return; }
      const url = data?.whatsappUrl;
      if (url) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Could not get WhatsApp link');
      }
    } catch {
      Alert.alert('Unable to open WhatsApp');
    }
  };

  // INVITE via WhatsApp (user not on app)
  const handleInviteWhatsApp = async () => {
    const url = `https://wa.me/91${mobile}?text=${encodeURIComponent(inviteMessage)}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('WhatsApp Not Found', 'Could not open WhatsApp. Try sharing via other apps.');
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

            <TouchableOpacity
              style={styles.shareInAppBtn}
              onPress={handleShareInApp}
              activeOpacity={0.85}
            >
              <Ionicons name="phone-portrait-outline" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>  Share In App</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>  Share on WhatsApp</Text>
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

            <TouchableOpacity
              style={styles.inviteWhatsappBtn}
              onPress={handleInviteWhatsApp}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>  Share via WhatsApp</Text>
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
  whatsappBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25D366',
    height: 50,
    borderRadius: 12,
    elevation: 3,
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
