
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { profileStyles } from '../../styles/screens/profileStyles';
import { COLORS } from '../../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import { clearSession } from '../../utils/storage';
import Footer from '../../components/common/Footer';

export default function ProfileScreen({ navigation, route }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first: '',
    middle: '',
    last: '',
    phone: '',
    email: '',
    profileImage: null,
  });
  const [editedData, setEditedData] = useState({
    first: '',
    middle: '',
    last: '',
    phone: '',
    email: '',
    profileImage: null,
  });
  const [loading, setLoading] = useState(true);
  const [pendingImage, setPendingImage] = useState(null);
  const fromScreen = route?.params?.fromScreen || null;

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const { res, data } = await apiFetch('/user/profile', { credentials: 'include' });
        if (res.status === 401) {
          Alert.alert('Session expired', 'Please log in again.');
          // Clear session/token here if needed
          navigation.replace('Login');
          return;
        }
        if (res.ok && data && data.status === 1 && data.data) {
          const mapped = {
            first: data.data.firstName || '',
            middle: data.data.middleName || '',
            last: data.data.lastName || '',
            phone: data.data.mobileNumber || '',
            email: data.data.email || '',
            profileImage: null,
          };
          setProfileData(mapped);
          setEditedData(mapped);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleImagePick = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission Required', 'Please allow gallery access to upload a profile photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setPendingImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleEditChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        firstName: editedData.first,
        middleName: editedData.middle,
        lastName: editedData.last,
        email: editedData.email,
      };
      const { res, data } = await apiFetch('/user/update-profile', {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        Alert.alert('Session expired', 'Please log in again.');
        navigation.replace('Login');
        return;
      }
      if (res.ok && data && data.status === 1 && data.data) {
        const mapped = {
          first: data.data.firstName || '',
          middle: data.data.middleName || '',
          last: data.data.lastName || '',
          phone: data.data.mobileNumber || '',
          email: data.data.email || '',
          profileImage: profileData.profileImage,
        };
        setProfileData(mapped);
        setEditedData(mapped);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
<<<<<<< HEAD
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // proceed with local logout even if API call fails
    } finally {
      await AsyncStorage.multiRemove(['loggedInUserId', 'userPhone', 'activeCardId', 'sessionCookie']);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
=======
      await apiFetch('/user/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // proceed with local logout even if API fails
>>>>>>> 0b042c43f4eaefd23cf4d00fc6fff725f55d685e
    }
    try {
      await clearSession();
    } catch {
      // ignore storage errors
    }
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (loading) {
    return (
      <SafeAreaView style={profileStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 🔥 Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: '#fff',
          elevation: 3
        }}>
          <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
            <Ionicons name="arrow-back" size={24} color={COLORS.accent} />
          </TouchableOpacity>

          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: COLORS.accent
          }}>
            My Profile
          </Text>

          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Ionicons
              name={isEditing ? 'close' : 'create-outline'}
              size={24}
              color={COLORS.accent}
            />
          </TouchableOpacity>
        </View>

        {/* 🔥 Avatar Section */}
        <View style={{
          alignItems: 'center',
          marginTop: 30
        }}>
          <TouchableOpacity onPress={isEditing ? handleImagePick : undefined}>
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: COLORS.accent,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 6
            }}>
              {editedData.profileImage ? (
                <Image
                  source={{ uri: editedData.profileImage }}
                  style={{ width: 120, height: 120, borderRadius: 60 }}
                />
              ) : (
                <Text style={{
                  fontSize: 40,
                  fontWeight: 'bold',
                  color: '#fff'
                }}>
                  {profileData.first?.charAt(0).toUpperCase() || 'U'}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            marginTop: 12
          }}>
            {profileData.first} {profileData.last}
          </Text>

          <Text style={{
            color: '#777',
            marginTop: 4
          }}>
            {profileData.email}
          </Text>
        </View>

        {/* 🔥 Details Card */}
        <View style={{
          backgroundColor: '#fff',
          marginHorizontal: 20,
          marginTop: 25,
          borderRadius: 16,
          padding: 20,
          elevation: 4
        }}>

          {[
            { label: 'First Name', key: 'first', icon: 'person' },
            { label: 'Middle Name', key: 'middle', icon: 'person-outline' },
            { label: 'Last Name', key: 'last', icon: 'person' },
            { label: 'Email', key: 'email', icon: 'mail' },
            { label: 'Phone', key: 'phone', icon: 'call' }
          ].map((item, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: index !== 4 ? 0.5 : 0,
              borderColor: '#eee'
            }}>
              <Ionicons
                name={item.icon}
                size={18}
                color={COLORS.accent}
                style={{ marginRight: 15 }}
              />

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#999' }}>
                  {item.label}
                </Text>

                {isEditing && item.key !== 'phone' ? (
                  <TextInput
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginTop: 3
                    }}
                    value={editedData[item.key]}
                    onChangeText={(value) =>
                      handleEditChange(item.key, value)
                    }
                    editable={item.key !== 'phone' ? true : false}
                  />
                ) : (
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '500',
                    marginTop: 3
                  }}>
                    {profileData[item.key]}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* 🔥 Action Buttons */}
        {isEditing && (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            marginTop: 20
          }}>
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: COLORS.accent,
                alignItems: 'center',
                marginRight: 10
              }}
              onPress={handleCancel}
            >
              <Text style={{ color: COLORS.accent, fontWeight: '600' }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 10,
                backgroundColor: COLORS.accent,
                alignItems: 'center'
              }}
              onPress={handleSave}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 🔥 Logout */}
        <TouchableOpacity
          style={{
            marginTop: 35,
            marginHorizontal: 40,
            backgroundColor: '#FF3B30',
            paddingVertical: 14,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 3,
          }}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={{
            color: '#fff',
            fontWeight: '600',
            fontSize: 15
          }}>
            Logout
          </Text>
        </TouchableOpacity>


        <View style={{ height: 30 }} />
      </ScrollView>

      <Footer
        activeTab="profile"
        navigation={navigation}
        fromScreen={fromScreen || null}
      />

      {/* ── Image Confirm Modal ── */}
      <Modal visible={!!pendingImage} transparent animationType="fade">
        <View style={imgStyles.overlay}>
          <View style={imgStyles.card}>
            <Text style={imgStyles.title}>Use this photo?</Text>
            {pendingImage && (
              <Image source={{ uri: pendingImage }} style={imgStyles.preview} />
            )}
            <View style={imgStyles.row}>
              <TouchableOpacity
                style={imgStyles.cancelBtn}
                onPress={() => setPendingImage(null)}
              >
                <Text style={imgStyles.cancelText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={imgStyles.doneBtn}
                onPress={() => {
                  setEditedData({ ...editedData, profileImage: pendingImage });
                  setPendingImage(null);
                }}
              >
                <Text style={imgStyles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const imgStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  preview: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 24,
    resizeMode: 'cover',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C9A227',
    alignItems: 'center',
  },
  cancelText: {
    color: '#C9A227',
    fontWeight: '600',
    fontSize: 15,
  },
  doneBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#C9A227',
    alignItems: 'center',
  },
  doneText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
