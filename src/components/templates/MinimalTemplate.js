import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from "react-native";
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

const MinimalTemplate = ({ data, userData, landscape }) => {
  const d = data || userData || {};
  const phone = d.phone || d.mobile || d.whatsapp || null;
  const initial = d?.name ? d.name.trim().charAt(0).toUpperCase() : 'Y';

  const handlePdf = async (pdf) => {
    if (!pdf) return;
    try {
      let uri = typeof pdf === 'string' ? pdf : (pdf.uri || pdf.fileUri || pdf.localUri || pdf.path || pdf.url || null);

      if (uri && uri.startsWith('data:')) {
        const base64 = uri.split(',')[1];
        const file = new File(Paths.cache, `temp_${Date.now()}.pdf`);
        try {
          file.write(base64, { encoding: 'base64' });
        } catch (e) {
          file.create({ intermediates: true, overwrite: true });
          file.write(base64, { encoding: 'base64' });
        }
        uri = file.uri;
      }

      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri);
        return;
      }

      const supported = uri && await Linking.canOpenURL(uri);
      if (supported) await Linking.openURL(uri);
      else Alert.alert('Cannot open PDF', 'No handler available for this PDF.');
    } catch (e) { Alert.alert('Error opening PDF', e.message || String(e)); }
  };

  if (landscape) {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.leftSection}>
          <View style={styles.avatar}>
            {d?.profileImage ? (
              <Image source={{ uri: d.profileImage }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{initial}</Text>
            )}
          </View>
          <Text style={styles.name}>{d?.name || 'Your Name'}</Text>
          <Text style={styles.role}>{d?.designation || 'Your Role'}</Text>
          {d?.companyName ? (
            <Text style={styles.company}>{d.companyName}</Text>
          ) : null}
        </View>
        <View style={styles.rightSection}>
          <View style={styles.fieldBox}><Text style={styles.label}>Mobile</Text><Text style={styles.value}>{d?.phone || ''}</Text></View>
          <View style={styles.fieldBox}><Text style={styles.label}>Email</Text><Text style={styles.value} numberOfLines={1} ellipsizeMode='tail'>{d?.email || ''}</Text></View>
          <View style={styles.fieldBox}><Text style={styles.label}>Website</Text><Text style={styles.value}>{d?.website || ''}</Text></View>
          <View style={styles.fieldBox}><Text style={styles.label}>Address</Text><Text style={styles.value}>{d?.address || ''}</Text></View>
          <View style={styles.socialRow}>
            {d?.whatsapp ? (<TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {d?.linkedin ? (<TouchableOpacity onPress={() => Linking.openURL(d.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {d?.instagram ? (<TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${d.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {d?.twitter ? (<TouchableOpacity onPress={() => Linking.openURL(d.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {d?.facebook ? (<TouchableOpacity onPress={() => Linking.openURL(d.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {d?.youtube ? (<TouchableOpacity onPress={() => Linking.openURL(d.youtube)} style={styles.iconBtn}><Ionicons name="logo-youtube" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {d?.website ? (<TouchableOpacity onPress={() => Linking.openURL(d.website)} style={styles.iconBtn}><Ionicons name="globe" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* top decorative oval and positioned avatar/logo */}
      <View style={styles.topOval} />
      {d?.companyLogo ? (
        <Image source={{ uri: d.companyLogo }} style={styles.companyLogo} />
      ) : null}

      <View style={styles.avatarOuter}>
        <View style={styles.avatarInner}>
          {d?.profileImage ? (
            <Image source={{ uri: d.profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>
      </View>

      <View style={styles.fieldsContainer}>
        <View style={styles.fieldBox}><Text style={styles.label}>Name</Text><Text style={styles.value} numberOfLines={1} ellipsizeMode='tail'>{d?.name || '—'}</Text></View>
        {d?.designation ? <View style={styles.fieldBox}><Text style={styles.label}>Designation</Text><Text style={styles.value} numberOfLines={1} ellipsizeMode='tail'>{d.designation}</Text></View> : null}
        {d?.companyName ? <View style={styles.fieldBox}><Text style={styles.label}>Company Name</Text><Text style={styles.value} numberOfLines={1} ellipsizeMode='tail'>{d.companyName}</Text></View> : null}
        {d?.description || d?.businessDescription ? (
          <View style={styles.fieldBox}><Text style={styles.label}>Business Description</Text><Text style={styles.value} numberOfLines={1} ellipsizeMode='tail'>{d.description || d.businessDescription}</Text></View>
        ) : null}

        {phone ? (
          <TouchableOpacity activeOpacity={0.85} onPress={() => Linking.openURL(`tel:${phone}`)}>
            <View style={styles.fieldBox}><Text style={styles.label}>Mobile</Text><Text style={styles.value} numberOfLines={1} ellipsizeMode='tail'>{phone}</Text></View>
          </TouchableOpacity>
        ) : null}

        {d?.email ? (
          <TouchableOpacity activeOpacity={0.85} onPress={() => Linking.openURL(`mailto:${d.email}`)}>
            <View style={styles.fieldBox}><Text style={styles.label}>Email</Text><Text style={styles.value} numberOfLines={1} ellipsizeMode='tail'>{d.email}</Text></View>
          </TouchableOpacity>
        ) : null}

        {d?.website ? (
          <TouchableOpacity activeOpacity={0.85} onPress={() => Linking.openURL(d.website)}>
            <View style={styles.fieldBox}><Text style={styles.label}>Website</Text><Text style={styles.value} numberOfLines={1} ellipsizeMode='tail'>{d.website}</Text></View>
          </TouchableOpacity>
        ) : null}

        {d?.address ? (
          <TouchableOpacity activeOpacity={0.85} onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)}>
            <View style={styles.fieldBox}><Text style={styles.label}>Address</Text><Text style={styles.value} numberOfLines={1} ellipsizeMode='tail'>{d.address}</Text></View>
          </TouchableOpacity>
        ) : null}
      </View>

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
    paddingTop: 120,
    paddingBottom: 26,
    paddingHorizontal: 26,
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
  /* legacy companyLogo removed (replaced below) */
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
    justifyContent: 'space-around',
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
  /* new unified styles */
  companyLogo: {
    position: 'absolute',
    left: 16,
    top: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    resizeMode: 'cover',
    zIndex: 5,
  },
  avatarOuter: {
    position: 'absolute',
    top: 34,
    left: '50%',
    marginLeft: -44,
    borderWidth: 3,
    borderColor: '#D4AF37',
    borderRadius: 48,
    padding: 4,
    marginBottom: 12,
    zIndex: 10,
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#0B1023',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topOval: {
    position: 'absolute',
    top: 18,
    left: '6%',
    width: '88%',
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#D4AF37',
    zIndex: 1,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarText: {
    fontSize: 34,
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  fieldsContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 6,
  },
  fieldBox: {
    width: '100%',
    backgroundColor: '#0E131A',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    width: 120,
    color: '#EDEDED',
    fontWeight: '800',
    fontSize: 14,
    marginRight: 8,
  },
  value: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 20,
  },
});