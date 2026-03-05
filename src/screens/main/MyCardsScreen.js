import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getDashboard, removeDashboardCard } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';

const GOLD = '#C9A227';

export default function MyCardsScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const stored = await getDashboard();
        setCards(Array.isArray(stored) ? stored : []);
      } catch {
        setCards([]);
      } finally {
        setLoading(false);
      }
    };
    loadCards();
    const unsubscribe = navigation.addListener('focus', loadCards);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (index) => {
    await removeDashboardCard(index);
    const updated = await getDashboard();
    setCards(Array.isArray(updated) ? updated : []);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('CardDetailsScreen', { cardData: item })}
    >
      {/* ── Mini Card Header ── */}
      <View style={styles.cardHeader}>
        {/* Profile Image */}
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={26} color="#fff" />
          </View>
        )}

        {/* Name / Designation / Company */}
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>
            {item.name || 'Unnamed'}
          </Text>
          {(item.designation || item.role) ? (
            <Text style={styles.headerDesignation} numberOfLines={1}>
              {item.designation || item.role}
            </Text>
          ) : null}
          {(item.companyName || item.company) ? (
            <Text style={styles.headerCompany} numberOfLines={1}>
              {item.companyName || item.company}
            </Text>
          ) : null}
          {item.phone ? (
            <Text style={styles.headerPhone} numberOfLines={1}>{item.phone}</Text>
          ) : null}
        </View>
      </View>

      {/* ── Action Buttons Row ── */}
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={() => navigation.navigate('ShareCardScreen', { cardData: item })}
          activeOpacity={0.8}
        >
          <Ionicons name="share-social" size={15} color={GOLD} />
          <Text style={[styles.actionLabel, { color: GOLD }]}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditCardScreen', { cardData: item, cardIndex: index })}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={15} color="#2F80ED" />
          <Text style={[styles.actionLabel, { color: '#2F80ED' }]}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(index)}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={15} color="#EB5757" />
          <Text style={[styles.actionLabel, { color: '#EB5757' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      {/* ── Section Label ── */}
      <Text style={styles.sectionTitle}>My Cards</Text>

      {/* ── Content ── */}
      {loading ? null : cards.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="albums-outline" size={64} color={GOLD} />
          <Text style={styles.emptyText}>No saved cards yet</Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

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
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3E9D2',
    shadowColor: '#C9A227',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  /* ── Mini Card Header ── */
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: '#333',
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: GOLD,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: GOLD,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 3,
  },
  headerDesignation: {
    fontSize: 12,
    color: GOLD,
    marginBottom: 2,
  },
  headerCompany: {
    fontSize: 12,
    color: '#BBBBBB',
    marginBottom: 2,
  },
  headerPhone: {
    fontSize: 11,
    color: '#888',
  },

  /* ── Action Buttons Footer ── */
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F3E9D2',
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#F3E9D2',
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#F3E9D2',
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  /* Empty */
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 14,
  },
});
