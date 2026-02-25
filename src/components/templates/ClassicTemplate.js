import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const ClassicTemplate = ({ userData }) => {
  const initial = userData?.name ? userData.name.trim().charAt(0).toUpperCase() : 'Y';

  return (
    <View style={styles.card}>
      {/* Company logo top-right */}
      {userData?.companyLogo ? (
        <Image source={{ uri: userData.companyLogo }} style={styles.companyLogo} />
      ) : null}

      {/* Neon Circle Avatar */}
      <View style={styles.avatarOuter}>
        <View style={styles.avatarInner}>
          {userData?.profileImage ? (
            <Image source={{ uri: userData.profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>
      </View>

      <Text style={styles.name}>{userData?.name || 'Your Name'}</Text>

      <Text style={styles.role}>{userData?.designation || 'Your Role'}</Text>

      {userData?.companyName ? (
        <Text style={styles.company}>{userData.companyName}</Text>
      ) : null}

      {userData?.businessDescription ? (
        <Text style={styles.description}>{userData.businessDescription}</Text>
      ) : null}

      <View style={styles.infoBox}>
        <Text style={styles.info}>📞 {userData?.phone || ''}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.info}>✉ {userData?.email || ''}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.info}>🌐 {userData?.website || ''}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.info}>📍 {userData?.address || ''}</Text>
      </View>

      {/* QR Code - show only if user uploaded a QR in Social Media */}
      {userData?.qrCodeImage ? (
        <View style={styles.qrContainer}>
          <Image source={{ uri: userData.qrCodeImage }} style={styles.qrImageCentered} />
        </View>
      ) : null}

      <View style={styles.socialRow}>
        {userData?.whatsapp ? (<TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${userData.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={18} color="#00E5FF" /></TouchableOpacity>) : null}
        {userData?.linkedin ? (<TouchableOpacity onPress={() => Linking.openURL(userData.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={18} color="#00E5FF" /></TouchableOpacity>) : null}
        {userData?.instagram ? (<TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${userData.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={18} color="#00E5FF" /></TouchableOpacity>) : null}
        {userData?.twitter ? (<TouchableOpacity onPress={() => Linking.openURL(userData.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={18} color="#00E5FF" /></TouchableOpacity>) : null}
        {userData?.facebook ? (<TouchableOpacity onPress={() => Linking.openURL(userData.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={18} color="#00E5FF" /></TouchableOpacity>) : null}
        {userData?.youtube ? (<TouchableOpacity onPress={() => Linking.openURL(userData.youtube)} style={styles.iconBtn}><Ionicons name="logo-youtube" size={18} color="#00E5FF" /></TouchableOpacity>) : null}
        {userData?.website ? (<TouchableOpacity onPress={() => Linking.openURL(userData.website)} style={styles.iconBtn}><Ionicons name="globe" size={18} color="#00E5FF" /></TouchableOpacity>) : null}
      </View>
      {/* Scanned / Existing visiting card preview */}
      {userData?.businessCard ? (
        <View style={styles.scannedCard}>
          <Image source={{ uri: userData.businessCard }} style={styles.scannedCardImage} />
        </View>
      ) : null}
    </View>
  );
};

export default ClassicTemplate;

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#0B1023",
    borderWidth: 2,
    borderColor: "#00E5FF",
    alignItems: "center",
    elevation: 10,
  },
  avatarOuter: {
    borderWidth: 3,
    borderColor: "#00E5FF",
    borderRadius: 70,
    padding: 6,
    marginBottom: 12,
  },
  avatarInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    color: "#00E5FF",
    fontWeight: "bold",
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  companyLogo: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  qrImage: {
    width: 80,
    height: 80,
    marginTop: 12,
    alignSelf: 'center',
  },
  qrContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  qrImageCentered: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  role: {
    fontSize: 16,
    color: "#00E5FF",
    marginBottom: 18,
  },
  company: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 12,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#020617",
    padding: 14,
    borderRadius: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#00E5FF",
  },
  info: {
    color: "#E5E7EB",
    fontSize: 15,
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  iconBtn: {
    marginHorizontal: 6,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.08)'
  },
  scannedCard: {
    width: '100%',
    height: 90,
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannedCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});