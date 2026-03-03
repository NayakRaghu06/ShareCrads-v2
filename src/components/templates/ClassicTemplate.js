import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from "react-native";
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

const ClassicTemplate = ({ userData, data }) => {
  const d = data || userData || {};
  const phone = d.phone || d.mobile || d.whatsapp || null;
  const initial = d?.name ? d.name.trim().charAt(0).toUpperCase() : 'Y';

  const handlePdf = async (pdf) => {
    if (!pdf) return;
    try {
      let uri = typeof pdf === 'string' ? pdf : (pdf.uri || pdf.fileUri || pdf.localUri || pdf.path || pdf.url || null);

      // handle base64 data URIs
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
        // prefer sharing for local files, but Sharing can accept remote urls on some platforms
        await Sharing.shareAsync(uri);
        return;
      }

      // fallback to opening in browser or external app
      const supported = uri && await Linking.canOpenURL(uri);
      if (supported) await Linking.openURL(uri);
      else Alert.alert('Cannot open PDF', 'No handler available for this PDF.');
    } catch (e) {
      Alert.alert('Error opening PDF', e.message || String(e));
    }
  };

  return (
    <View style={styles.card}>
      {/* decorative corner boxes */}
      <View style={styles.cornerBoxTopLeft} />
      <View style={styles.cornerBoxTopRight} />
      <View style={styles.cornerBoxBottomLeft} />
      <View style={styles.cornerBoxBottomRight} />
      {/* Company logo fixed top-left */}
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

      {/* Uniform field boxes for all fields */}
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
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#070912",
    borderWidth: 1,
    borderColor: "#0F1724",
    alignItems: "center",
    alignSelf: 'center',
    width: '92%',
    maxWidth: 720,
    elevation: 12,
  },
  avatarOuter: {
    borderWidth: 3,
    borderColor: "#D4AF37",
    borderRadius: 48,
    padding: 4,
    marginBottom: 12,
    backgroundColor: 'transparent'
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#0B1023",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 34,
    color: "#D4AF37",
    fontWeight: "bold",
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  companyLogo: {
    position: 'absolute',
    left: 12,
    top: 12,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    resizeMode: 'cover',
    zIndex: 5,
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
  /* unified field box used for all data rows */
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
  info: {
    color: "#E5E7EB",
    fontSize: 15,
    textAlign: 'left',
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
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
  /* new alignment styles */
  fieldsContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
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
  /* small decorative corner boxes */
  cornerBoxTopLeft: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
    opacity: 0.95,
  },
  cornerBoxTopRight: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
    opacity: 0.95,
  },
  cornerBoxBottomLeft: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
    opacity: 0.95,
  },
  cornerBoxBottomRight: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
    opacity: 0.95,
  },
  /* responsive tweaks */
  qrContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
});