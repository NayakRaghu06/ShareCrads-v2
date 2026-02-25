import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const MinimalTemplate = ({ userData }) => {
  const initial = userData?.name ? userData.name.trim().charAt(0).toUpperCase() : 'Y';

  return (
    <View style={styles.container}>
      {userData?.companyLogo ? (
        <Image source={{ uri: userData.companyLogo }} style={styles.companyLogo} />
      ) : null}

      <View style={styles.avatar}>
        {userData?.profileImage ? (
          <Image source={{ uri: userData.profileImage }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{initial}</Text>
        )}
      </View>

      <Text style={styles.name}>{userData?.name || 'Your Name'}</Text>

      <Text style={styles.role}>{userData?.designation || 'Your Role'}</Text>

      {userData?.companyName ? (
        <Text style={styles.company}>{userData.companyName}</Text>
      ) : null}

      {userData?.businessDescription ? (
        <Text style={styles.description}>{userData.businessDescription}</Text>
      ) : null}

      <Text style={styles.info}>📞 {userData?.phone || ''}</Text>
      <Text style={styles.info}>✉ {userData?.email || ''}</Text>
      <Text style={styles.info}>🌐 {userData?.website || ''}</Text>
      <Text style={styles.info}>📍 {userData?.address || ''}</Text>

      {userData?.qrCodeImage ? (
        <View style={styles.qrContainer}>
          <Image source={{ uri: userData.qrCodeImage }} style={styles.qrImageCentered} />
        </View>
      ) : null}

      <View style={styles.socialRow}>
        {userData?.whatsapp ? (<TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${userData.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {userData?.linkedin ? (<TouchableOpacity onPress={() => Linking.openURL(userData.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {userData?.instagram ? (<TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${userData.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {userData?.twitter ? (<TouchableOpacity onPress={() => Linking.openURL(userData.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {userData?.facebook ? (<TouchableOpacity onPress={() => Linking.openURL(userData.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {userData?.youtube ? (<TouchableOpacity onPress={() => Linking.openURL(userData.youtube)} style={styles.iconBtn}><Ionicons name="logo-youtube" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {userData?.website ? (<TouchableOpacity onPress={() => Linking.openURL(userData.website)} style={styles.iconBtn}><Ionicons name="globe" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
      </View>
      {userData?.businessCard ? (
        <View style={styles.scannedCard}>
          <Image source={{ uri: userData.businessCard }} style={styles.scannedCardImage} />
        </View>
      ) : null}
    </View>
  );
};

export default MinimalTemplate;

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 26,
    borderRadius: 24,
    backgroundColor: "#0F0F0F",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    alignItems: "center",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 34,
    color: "#D4AF37",
    fontWeight: "bold",
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  companyLogo: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 60,
    height: 36,
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
    color: "#D4AF37",
    fontWeight: "bold",
  },
  role: {
    fontSize: 16,
    color: "#E5E5E5",
    marginBottom: 16,
  },
  company: {
    fontSize: 14,
    color: '#F8EFD0',
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: '#D1C7B7',
    textAlign: 'center',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: "#E5E5E5",
    marginVertical: 4,
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    marginHorizontal: 6,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.08)'
  }
  ,
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