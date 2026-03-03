import React from "react";
<<<<<<< HEAD
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from "react-native";
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

const MinimalTemplate = ({ userData, data }) => {
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
=======
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const MinimalTemplate = ({ data, landscape }) => {
  const userData = data || {};
  const initial = userData?.name ? userData.name.trim().charAt(0).toUpperCase() : 'Y';
>>>>>>> bf81763f2212004d36b66297f710ca1cf2998c3d

  if (landscape) {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.leftSection}>
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
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.info}>📞 {userData?.phone || ''}</Text>
          <Text style={styles.info}>✉ {userData?.email || ''}</Text>
          <Text style={styles.info}>🌐 {userData?.website || ''}</Text>
          <Text style={styles.info}>📍 {userData?.address || ''}</Text>
          <View style={styles.socialRow}>
            {userData?.whatsapp ? (<TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${userData.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {userData?.linkedin ? (<TouchableOpacity onPress={() => Linking.openURL(userData.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {userData?.instagram ? (<TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${userData.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {userData?.twitter ? (<TouchableOpacity onPress={() => Linking.openURL(userData.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {userData?.facebook ? (<TouchableOpacity onPress={() => Linking.openURL(userData.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {userData?.youtube ? (<TouchableOpacity onPress={() => Linking.openURL(userData.youtube)} style={styles.iconBtn}><Ionicons name="logo-youtube" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {userData?.website ? (<TouchableOpacity onPress={() => Linking.openURL(userData.website)} style={styles.iconBtn}><Ionicons name="globe" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
          </View>
        </View>
      </View>
    );
  }
  // ...existing code...
  return (
    <View style={styles.container}>
<<<<<<< HEAD
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

      <View style={styles.socialRow}>
        {phone ? (<TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)} style={styles.iconBtn}><Ionicons name="call" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.whatsapp ? (<TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.linkedin ? (<TouchableOpacity onPress={() => Linking.openURL(d.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.instagram ? (<TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${d.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.twitter ? (<TouchableOpacity onPress={() => Linking.openURL(d.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.facebook ? (<TouchableOpacity onPress={() => Linking.openURL(d.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.youtube ? (<TouchableOpacity onPress={() => Linking.openURL(d.youtube)} style={styles.iconBtn}><Ionicons name="logo-youtube" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.website ? (<TouchableOpacity onPress={() => Linking.openURL(d.website)} style={styles.iconBtn}><Ionicons name="globe" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.descriptionPdf ? (<TouchableOpacity onPress={() => handlePdf(d.descriptionPdf)} style={styles.iconBtn}><Ionicons name="document" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.address ? (<TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)} style={styles.iconBtn}><Ionicons name="location" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
      </View>
      {/* visiting card removed */}
=======
      {/* ...existing code... */}
>>>>>>> bf81763f2212004d36b66297f710ca1cf2998c3d
    </View>
  );
};

export default MinimalTemplate;

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    marginBottom: 18,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: 12,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 12,
  },
  container: {
    margin: 16,
    padding: 26,
    borderRadius: 24,
    backgroundColor: "#0F0F0F",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
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