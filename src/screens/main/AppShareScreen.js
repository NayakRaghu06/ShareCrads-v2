import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../styles/colors';

export default function AppShareScreen({ navigation, route }) {
  const { cardData } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color={COLORS.accent} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Shared Card</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* CARD PREVIEW */}
      <View style={styles.cardBox}>
        <Text style={styles.name}>{cardData.name}</Text>
        <Text style={styles.company}>{cardData.companyName}</Text>
        <Text style={styles.phone}>{cardData.phone}</Text>
        <Text style={styles.email}>{cardData.email}</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent
  },

  cardBox: {
    margin: 24,
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#f7f7f7',
    elevation: 4
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },

  company: {
    fontSize: 16,
    marginBottom: 6
  },

  phone: {
    fontSize: 15,
    marginBottom: 6
  },

  email: {
    fontSize: 15
  }
});
