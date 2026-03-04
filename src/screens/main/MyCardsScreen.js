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
const BTN_SIZE = 36;

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
      <View style={styles.cardRow}>

        {/* Left: Thumbnail */}
        {item.savedImage ? (
          <Image source={{ uri: item.savedImage }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Ionicons name="card-outline" size={28} color={GOLD} />
          </View>
        )}

        {/* Middle: Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{item.name || 'Unnamed'}</Text>
          {(item.designation || item.role) ? (
            <Text style={styles.designation} numberOfLines={1}>
              {item.designation || item.role}
            </Text>
          ) : null}
          {(item.companyName || item.company) ? (
            <Text style={styles.company} numberOfLines={1}>
              {item.companyName || item.company}
            </Text>
          ) : null}
          {item.phone ? (
            <Text style={styles.phone} numberOfLines={1}>{item.phone}</Text>
          ) : null}
        </View>

        {/* Right: Action Buttons */}
        <View style={styles.actions}>
          {/* Share — full gold */}
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => navigation.navigate('ShareCardScreen', { cardData: item })}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social" size={17} color="#fff" />
          </TouchableOpacity>

          {/* Edit — gold outline */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditCardScreen', { cardData: item, cardIndex: index })}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={17} color={GOLD} />
          </TouchableOpacity>

          {/* Delete — red outline */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(index)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={17} color="#DC2626" />
          </TouchableOpacity>
        </View>

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
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3E9D2',
    shadowColor: '#C9A227',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Thumbnail */
  thumb: {
    width: 62,
    height: 62,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: '#F5F5F5',
  },
  thumbPlaceholder: {
    width: 62,
    height: 62,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: '#FDF6E3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3E9D2',
  },

  /* Info */
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  designation: {
    fontSize: 13,
    color: GOLD,
    marginBottom: 2,
  },
  company: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  phone: {
    fontSize: 12,
    color: '#888',
  },

  /* Action Buttons */
  actions: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    gap: 7,
  },
  shareBtn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: 8,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
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
