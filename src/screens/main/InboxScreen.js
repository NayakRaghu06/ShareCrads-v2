import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';

const GOLD = '#C9A227';

const mockInbox = [
  { id: '1', sender: 'John Doe', company: 'Acme Corp', time: '2 min ago' },
  { id: '2', sender: 'Jane Smith', company: 'Beta Ltd', time: '10 min ago' },
];

function InboxScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      {/* ── Section Label ── */}
      <Text style={styles.sectionTitle}>Inbox</Text>

      {/* ── List ── */}
      <FlatList
        data={mockInbox}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>

              {/* Left: Avatar icon */}
              <View style={styles.avatarWrap}>
                <Ionicons name="person-circle" size={48} color={GOLD} />
              </View>

              {/* Middle: Name + Company */}
              <View style={styles.info}>
                <Text style={styles.sender} numberOfLines={1}>{item.sender}</Text>
                <Text style={styles.company} numberOfLines={1}>{item.company}</Text>
              </View>

              {/* Right: Time */}
              <Text style={styles.time}>{item.time}</Text>

            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No cards received yet.</Text>
        }
      />
    </SafeAreaView>
  );
}

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* ── Section Label ── */
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 0.4,
    textAlign: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3E9D2',
  },

  /* ── List ── */
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },

  /* ── Card ── */
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3E9D2',
    shadowColor: GOLD,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Avatar */
  avatarWrap: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Info */
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  sender: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  company: {
    fontSize: 13,
    color: '#888',
  },

  /* Time */
  time: {
    fontSize: 12,
    color: GOLD,
    fontWeight: '600',
    marginLeft: 10,
    flexShrink: 0,
  },

  /* Empty */
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
});
