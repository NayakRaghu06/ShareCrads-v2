import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from "react-native";
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

const ClassicTemplate = ({ userData, data }) => {
  const d = data || userData || {};
  const phone = d.phone || d.mobile || d.whatsapp || null;
  const initial = d?.name ? d.name.trim().charAt(0).toUpperCase() : 'Y';

  const handlePdf = async (pdf) => {
    if (!pdf) return;
    const uri = typeof pdf === 'string' ? pdf : pdf.uri || pdf;
    try {
      const available = await Sharing.isAvailableAsync();
      if (available) await Sharing.shareAsync(uri);
      else Linking.canOpenURL(uri).then(supported => supported && Linking.openURL(uri)).catch(e => Alert.alert('Error', e.message));
    } catch (e) { Alert.alert('Error opening PDF', e.message); }
  };

  return (
    <View style={styles.card}>
      {/* Company logo top-right */}
      {d?.companyLogo ? (
        <Image source={{ uri: d.companyLogo }} style={styles.companyLogo} />
      ) : null}

      {/* Neon Circle Avatar */}
      <View style={styles.avatarOuter}>
        <View style={styles.avatarInner}>
          {d?.profileImage ? (
            <Image source={{ uri: d.profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>
      </View>

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

      {phone ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.infoBox}
          onPress={() => Linking.openURL(`tel:${phone}`)}
        >
          <Text style={styles.info}><Text style={{fontWeight:'700'}}>Mobile:</Text>  {phone}</Text>
        </TouchableOpacity>
      ) : null}

      {d?.email ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.infoBox}
          onPress={() => Linking.openURL(`mailto:${d.email}`)}
        >
          <Text style={styles.info}><Text style={{fontWeight:'700'}}>Email:</Text>  {d.email}</Text>
        </TouchableOpacity>
      ) : null}

      {d?.website ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.infoBox}
          onPress={() => Linking.openURL(d.website)}
        >
          <Text style={styles.info}>🌐 {d.website}</Text>
        </TouchableOpacity>
      ) : null}

      {d?.address ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.infoBox}
          onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)}
        >
          <Text style={styles.info}><Text style={{fontWeight:'700'}}>Address:</Text>  {d.address}</Text>
        </TouchableOpacity>
      ) : null}

      {/* QR Code - uploaded image (auto-generated QR disabled) */}
      {d?.qrCodeImage ? (
        <View style={styles.qrContainer}>
          <Image source={{ uri: d.qrCodeImage }} style={styles.qrImageCentered} />
        </View>
      ) : null}

      <View style={styles.socialRow}>
        {phone ? (<TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)} style={styles.iconBtn}><Ionicons name="call" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.whatsapp ? (<TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.linkedin ? (<TouchableOpacity onPress={() => Linking.openURL(d.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.instagram ? (<TouchableOpacity onPress={() => Linking.openURL(d.instagram.startsWith('http') ? d.instagram : `https://instagram.com/${d.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.twitter ? (<TouchableOpacity onPress={() => Linking.openURL(d.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.facebook ? (<TouchableOpacity onPress={() => Linking.openURL(d.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.youtube ? (<TouchableOpacity onPress={() => Linking.openURL(d.youtube)} style={styles.iconBtn}><Ionicons name="logo-youtube" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.website ? (<TouchableOpacity onPress={() => Linking.openURL(d.website)} style={styles.iconBtn}><Ionicons name="globe" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.descriptionPdf ? (<TouchableOpacity onPress={() => handlePdf(d.descriptionPdf)} style={styles.iconBtn}><Ionicons name="document" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.address ? (<TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)} style={styles.iconBtn}><Ionicons name="location" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
      </View>
      {/* visiting card removed (no longer used) */}
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
    textAlign: 'left',
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