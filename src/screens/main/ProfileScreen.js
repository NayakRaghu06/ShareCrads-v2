
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { profileStyles } from '../../styles/screens/profileStyles';
import { COLORS } from '../../styles/colors';
import { getUser, saveUser, clearUser } from '../../utils/storage';
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

  const [editedData, setEditedData] = useState(profileData);
  const [loading, setLoading] = useState(true);
  const fromScreen = route?.params?.fromScreen || null;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getUser();
        if (user) {
          setProfileData(user);
          setEditedData(user);
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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setEditedData({ ...editedData, profileImage: result.assets[0].uri });
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
      await saveUser(editedData);
      setProfileData(editedData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
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
      await clearUser();
      navigation.replace('Splash');
    } catch {
      Alert.alert('Error', 'Failed to logout');
    }
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

                {isEditing ? (
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
                    editable={true}

                  />
                ) : (
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '500',
                    marginTop: 3
                  }}>
                    {profileData[item.key] || 'N/A'}
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
    </SafeAreaView>
  );
}
