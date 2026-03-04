import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';

const GOLD = '#C9A227';
const GOLD_LIGHT = '#E6D7A3';
const GOLD_BG = '#FDF6E3';

export default function ShareCardScreen({ navigation, route }) {
  const { cardData } = route.params;

  const [mobile, setMobile] = useState('');
  const [userStatus, setUserStatus] = useState('none');
  // "none" | "found" | "notfound"

  const cardLink = `https://sharecards.in/card/${cardData.phone}`;
  const waMessage = `Check my Digital Business Card 👇\n\n${cardLink}`;

  // CHECK USER
  const handleCheckUser = () => {
    if (mobile.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10 digit mobile number.');
      return;
    }
    if (mobile === '9876543210') {
      setUserStatus('found');
    } else {
      setUserStatus('notfound');
    }
  };

  // SHARE ON WHATSAPP
  const handleWhatsApp = async () => {
    const url = `https://wa.me/91${mobile}?text=${encodeURIComponent(waMessage)}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open WhatsApp');
    }
  };

  // SEND INVITATION via SMS
  const handleSendInvite = () => {
    if (mobile.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10 digit mobile number.');
      return;
    }
    const smsMessage =
      'Hi! Join Digital Business Card (DBC) to receive my card. Download the app and connect with me.';
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = `sms:${mobile}${separator}body=${encodeURIComponent(smsMessage)}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open SMS app.')
    );
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
            onChangeText={(t) => { setMobile(t); setUserStatus('none'); }}
          />
        </View>

        {/* ── Check User Button ── */}
        <TouchableOpacity style={styles.checkBtn} onPress={handleCheckUser} activeOpacity={0.85}>
          <Text style={styles.checkBtnText}>Check User</Text>
        </TouchableOpacity>

        {/* ── USER FOUND ── */}
        {userStatus === 'found' && (
          <>
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={styles.successText}>  User Found!</Text>
            </View>

            <View style={styles.userCard}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={styles.profile}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Rahul Sharma</Text>
                <Text style={styles.userDesignation}>Software Engineer</Text>
                <Text style={styles.userCompany}>DBC Technologies</Text>
              </View>
            </View>

            <View style={styles.shareTitleRow}>
              <View style={styles.divider} />
              <Text style={styles.shareTitle}>Choose Share Option:</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.shareInAppBtn}
              onPress={() => navigation.navigate('AppShareScreen', { cardData })}
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
              style={styles.inviteBtn}
              onPress={handleSendInvite}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>  Send Invitation</Text>
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
  profile: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
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

  /* ── Invite (SMS) Button ── */
  inviteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GOLD,
    height: 50,
    borderRadius: 12,
    marginTop: 16,
    elevation: 3,
    shadowColor: GOLD,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
