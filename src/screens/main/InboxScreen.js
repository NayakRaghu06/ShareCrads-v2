import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { StatusBar as RNStatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const mockInbox = [
  { id: '1', sender: 'John Doe', company: 'Acme Corp', time: '2 min ago' },
  { id: '2', sender: 'Jane Smith', company: 'Beta Ltd', time: '10 min ago' },
];

function InboxScreen({ navigation }) {
  const statusBarPad = Platform.OS === 'ios' ? 50 : 35;
  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: statusBarPad }]}> 
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#D4AF37" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitleTop}>DIGITAL</Text>
          <Text style={styles.headerTitleBottom}>BUSINESS CARD</Text>
        </View>
        {/* Gold divider */}
        <View style={styles.goldDivider} />
      </View>
      <FlatList
        data={mockInbox}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="person-circle" size={32} color="#D4AF37" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sender}>{item.sender}</Text>
                <Text style={styles.company}>{item.company}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No cards received yet.</Text>}
      />
    </View>
  );
}

export default InboxScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
    backgroundColor: '#fff',
    height: 95,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 0,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 38,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 2,
  },
  headerTitleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  headerTitleTop: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 0,
    lineHeight: 22,
  },
  headerTitleBottom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 22,
  },
  goldDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: '#D4AF37',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3E9D2',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sender: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  company: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#D4AF37',
    marginLeft: 10,
    fontWeight: '500',
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
});
