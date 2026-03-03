import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from "react-native";
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

const ModernTemplate = ({ userData, data }) => {
  const d = data || userData || {};
  const phone = d.phone || d.mobile || d.whatsapp || null;
  const initial = d?.name ? d.name.trim().charAt(0).toUpperCase() : 'Y';

  const handlePdf = async (pdf) => {
    if (!pdf) return;
    const uri = typeof pdf === 'string' ? pdf : pdf.uri || pdf;
    try {
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri);
      } else {
        Linking.canOpenURL(uri).then(supported => supported && Linking.openURL(uri)).catch(e => Alert.alert('Error', e.message));
      }
    } catch (e) {
      Alert.alert('Error opening PDF', e.message);
    }
  };

  return (
    <View style={styles.card}>
      {d?.companyLogo ? (
        <Image source={{ uri: d.companyLogo }} style={styles.companyLogo} />
      ) : null}

      <View style={styles.avatar}>
        {d?.profileImage ? (
          <Image source={{ uri: d.profileImage }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{initial}</Text>
        )}
      </View>

      <View style={styles.nameBox}>
        {/* Title block removed to avoid duplication; labeled fields shown below */}
        {/* Labeled fields: Name / Designation / Company / Business Description */}
        <View style={{ width: '85%', alignSelf: 'center', marginTop: 12, alignItems: 'flex-start' }}>
          <Text style={styles.info}><Text style={{fontWeight:'700'}}>Name:</Text>  {d?.name || '—'}</Text>
          {d?.designation ? <Text style={styles.info}><Text style={{fontWeight:'700'}}>Designation:</Text>  {d.designation}</Text> : null}
          {d?.companyName ? <Text style={styles.info}><Text style={{fontWeight:'700'}}>Company Name:</Text>  {d.companyName}</Text> : null}
          {d?.description || d?.businessDescription ? (
            <Text style={styles.info}><Text style={{fontWeight:'700'}}>Business Description:</Text>  {d.description || d.businessDescription}</Text>
          ) : null}
        </View>
      </View>

      {phone ? (
        <TouchableOpacity activeOpacity={0.8} onPress={() => Linking.openURL(`tel:${phone}`)}>
          <Text style={styles.info}><Text style={{fontWeight:'700'}}>Mobile:</Text>  {phone}</Text>
        </TouchableOpacity>
      ) : null}
      {d?.email ? (
        <TouchableOpacity activeOpacity={0.8} onPress={() => Linking.openURL(`mailto:${d.email}`)}>
          <Text style={styles.info}><Text style={{fontWeight:'700'}}>Email:</Text>  {d.email}</Text>
        </TouchableOpacity>
      ) : null}
      {d?.website ? (
        <TouchableOpacity activeOpacity={0.8} onPress={() => Linking.openURL(d.website)}>
          <Text style={styles.info}>🌐 {d.website}</Text>
        </TouchableOpacity>
      ) : null}
      {d?.address ? (
        <TouchableOpacity activeOpacity={0.8} onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)}>
          <Text style={styles.info}><Text style={{fontWeight:'700'}}>Address:</Text>  {d.address}</Text>
        </TouchableOpacity>
      ) : null}

      {d?.qrCodeImage ? (
        <View style={styles.qrContainer}>
          <Image source={{ uri: d.qrCodeImage }} style={styles.qrImageCentered} />
        </View>
      ) : null}

      {/* Social icons */}
      <View style={styles.socialRow}>
        {phone ? (<TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)} style={styles.iconBtn}><Ionicons name="call" size={20} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.whatsapp ? (
          <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={20} color="#D4AF37" /></TouchableOpacity>
        ) : null}
        {d?.linkedin ? (
          <TouchableOpacity onPress={() => Linking.openURL(d.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={20} color="#D4AF37" /></TouchableOpacity>
        ) : null}
        {d?.instagram ? (
          <TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${d.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={20} color="#D4AF37" /></TouchableOpacity>
        ) : null}
        {d?.twitter ? (
          <TouchableOpacity onPress={() => Linking.openURL(d.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={20} color="#D4AF37" /></TouchableOpacity>
        ) : null}
        {d?.facebook ? (
          <TouchableOpacity onPress={() => Linking.openURL(d.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={20} color="#D4AF37" /></TouchableOpacity>
        ) : null}
        {d?.youtube ? (
          <TouchableOpacity onPress={() => Linking.openURL(d.youtube)} style={styles.iconBtn}><Ionicons name="logo-youtube" size={20} color="#D4AF37" /></TouchableOpacity>
        ) : null}
        {d?.website ? (
          <TouchableOpacity onPress={() => Linking.openURL(d.website)} style={styles.iconBtn}><Ionicons name="globe" size={20} color="#D4AF37" /></TouchableOpacity>
        ) : null}
        {d?.descriptionPdf ? (
          <TouchableOpacity onPress={() => handlePdf(d.descriptionPdf)} style={styles.iconBtn}><Ionicons name="document" size={20} color="#D4AF37" /></TouchableOpacity>
        ) : null}
        {d?.address ? (<TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)} style={styles.iconBtn}><Ionicons name="location" size={20} color="#D4AF37" /></TouchableOpacity>) : null}
      </View>
      {/* visiting card removed */}
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
    width: 80,
    height: 48,
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
    textAlign: 'left',
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