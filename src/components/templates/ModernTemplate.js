import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const ModernTemplate = ({ userData }) => {
  const initial = userData?.name ? userData.name.trim().charAt(0).toUpperCase() : 'Y';

  return (
    <View style={styles.card}>
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

      <View style={styles.nameBox}>
        <Text style={styles.name}>{userData?.name || 'Your Name'}</Text>
        <Text style={styles.role}>{userData?.designation || 'Your Role'}</Text>
        {userData?.companyName ? (
          <Text style={styles.company}>{userData.companyName}</Text>
        ) : null}
        {userData?.businessDescription ? (
          <Text style={styles.description}>{userData.businessDescription}</Text>
        ) : null}
      </View>

      <Text style={styles.info}>📞 {userData?.phone || ''}</Text>
      <Text style={styles.info}>✉ {userData?.email || ''}</Text>
      <Text style={styles.info}>🌐 {userData?.website || ''}</Text>
      <Text style={styles.info}>📍 {userData?.address || ''}</Text>

      {userData?.qrCodeImage ? (
        <View style={styles.qrContainer}>
          <Image source={{ uri: userData.qrCodeImage }} style={styles.qrImageCentered} />
        </View>
      ) : null}

      {/* Social icons */}
      <View style={styles.socialRow}>
        {userData?.whatsapp ? (
          <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${userData.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={20} color="#FFF" /></TouchableOpacity>
        ) : null}
        {userData?.linkedin ? (
          <TouchableOpacity onPress={() => Linking.openURL(userData.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={20} color="#FFF" /></TouchableOpacity>
        ) : null}
        {userData?.instagram ? (
          <TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${userData.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={20} color="#FFF" /></TouchableOpacity>
        ) : null}
        {userData?.twitter ? (
          <TouchableOpacity onPress={() => Linking.openURL(userData.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={20} color="#FFF" /></TouchableOpacity>
        ) : null}
        {userData?.facebook ? (
          <TouchableOpacity onPress={() => Linking.openURL(userData.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={20} color="#FFF" /></TouchableOpacity>
        ) : null}
        {userData?.youtube ? (
          <TouchableOpacity onPress={() => Linking.openURL(userData.youtube)} style={styles.iconBtn}><Ionicons name="logo-youtube" size={20} color="#FFF" /></TouchableOpacity>
        ) : null}
        {userData?.website ? (
          <TouchableOpacity onPress={() => Linking.openURL(userData.website)} style={styles.iconBtn}><Ionicons name="globe" size={20} color="#FFF" /></TouchableOpacity>
        ) : null}
      </View>
      {userData?.businessCard ? (
        <View style={styles.scannedCard}>
          <Image source={{ uri: userData.businessCard }} style={styles.scannedCardImage} />
        </View>
      ) : null}
    </View>
  );
};

export default ModernTemplate;

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#1F1147",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FF4081",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#374151",
  },
  avatarImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
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
  avatarText: {
    fontSize: 36,
    color: "#FFF",
    fontWeight: "bold",
  },
  nameBox: {
    backgroundColor: "#FF4081",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 18,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  role: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
  },
  company: {
    fontSize: 14,
    color: '#F3E8FF',
    textAlign: 'center',
    marginTop: 6,
  },
  description: {
    fontSize: 12,
    color: '#E6E6E6',
    textAlign: 'center',
    marginTop: 6,
  },
  info: {
    fontSize: 16,
    color: "#E5E7EB",
    marginVertical: 5,
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
    backgroundColor: 'rgba(0,0,0,0.15)'
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