import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../styles/colors';

export default function Footer({ activeTab = 'home', navigation, fromScreen = null }) {
  const handleHomePress = () => {
    navigation.navigate('Landing');
  };

  const handleContactsPress = () => {
    navigation.navigate('Contacts');
  };

  const handleProfilePress = () => {
    if (activeTab === 'profile' && fromScreen) {
      // If already on Profile, go back to previous screen
      navigation.pop();
    } else {
      // Navigate to Profile
      navigation.push('Profile', { fromScreen });
    }
  };

  return (
    <View style={styles.footerTabs}>
      <TouchableOpacity 
        style={[styles.footerTab, activeTab === 'home' && styles.footerTabActive]}
        onPress={handleHomePress}
      >
        <Ionicons 
          name={activeTab === 'home' ? 'home' : 'home-outline'} 
          size={24} 
          color={activeTab === 'home' ? COLORS.accent : '#999'}
        />
        <Text style={[styles.footerTabLabel, activeTab === 'home' && styles.footerTabLabelActive]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.footerTab, activeTab === 'contacts' && styles.footerTabActive]}
        onPress={handleContactsPress}
      >
        <Ionicons 
          name={activeTab === 'contacts' ? 'people' : 'people-outline'} 
          size={24} 
          color={activeTab === 'contacts' ? COLORS.accent : '#999'}
        />
        <Text style={[styles.footerTabLabel, activeTab === 'contacts' && styles.footerTabLabelActive]}>
          Contacts
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.footerTab, activeTab === 'profile' && styles.footerTabActive]}
        onPress={handleProfilePress}
      >
        <Ionicons 
          name={activeTab === 'profile' ? 'person' : 'person-outline'} 
          size={24} 
          color={activeTab === 'profile' ? COLORS.accent : '#999'}
        />
        <Text style={[styles.footerTabLabel, activeTab === 'profile' && styles.footerTabLabelActive]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: COLORS.accent,
    paddingVertical: 8,
    paddingBottom: 12,
  },
  footerTab: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  footerTabActive: {
    borderTopWidth: 3,
    borderTopColor: COLORS.accent,
    marginTop: -8,
    paddingTop: 5,
  },
  footerTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginTop: 4,
  },
  footerTabLabelActive: {
    color: COLORS.accent,
  },
});
