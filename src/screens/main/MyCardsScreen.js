import { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { apiFetch } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import AnimatedCard from '../../components/common/AnimatedCard';
import AnimatedPressable from '../../components/common/AnimatedPressable';

// ── Shimmer skeleton shown while cards are loading
const ShimmerBar = ({ width = '100%', height = 14, style }) => {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmer]);
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });
  return (
    <Animated.View style={[{ width, height, borderRadius: 6, backgroundColor: '#D4AF37', opacity }, style]} />
  );
};

const SkeletonCard = () => (
  <View style={sk.card}>
    <View style={sk.header}>
      <View style={sk.avatar} />
      <View style={{ flex: 1, gap: 8 }}>
        <ShimmerBar width="60%" height={12} />
        <ShimmerBar width="40%" height={10} />
        <ShimmerBar width="50%" height={10} />
      </View>
    </View>
    <View style={sk.footer}>
      <ShimmerBar width="28%" height={10} />
      <ShimmerBar width="28%" height={10} />
      <ShimmerBar width="28%" height={10} />
    </View>
  </View>
);

const sk = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3E9D2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2A2A4E',
    borderWidth: 2,
    borderColor: '#D4AF37',
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
});

const GOLD = '#C9A227';

export default function MyCardsScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCardId = useCallback((item = {}) => {
    const candidate =
      item.cardId ??
      item.id ??
      item.businessCardId ??
      item.business_card_id ??
      item.card?.cardId ??
      item.card?.id;

    const parsed = Number(candidate);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const { res, data } = await apiFetch('/api/cards/view-cards');
      if (res.status === 401) {
        navigation.replace('Login');
        return;
      }
      setCards(Array.isArray(data) ? data : []);
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
    const unsubscribe = navigation.addListener('focus', loadCards);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = useCallback((cardId) => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const { res } = await apiFetch(`/api/cards/delete-card/${cardId}`, { method: 'DELETE' });
            if (res.status === 401) {
              navigation.replace('Login');
              return;
            }

            // Update state locally instead of re-fetching the whole list
            setCards(prev => prev.filter(c => c.cardId !== cardId));
            loadCards();
          } catch {
            Alert.alert('Error', 'Failed to delete card');
          }
        },
      },
    ]);
  }, [navigation]);

  const renderItem = useCallback(({ item, index }) => (
    <AnimatedCard index={index}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('CardDetailsScreen', { cardData: item })}
      >
        <View style={styles.cardHeader}>
          {item.profileImage ? (
            <Image source={{ uri: item.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={26} color="#fff" />
            </View>
          )}

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
            {(item.phoneNumber || item.phone) ? (
              <Text style={styles.headerPhone} numberOfLines={1}>
                {item.phoneNumber || item.phone}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.cardFooter}>
          <AnimatedPressable
            style={styles.shareBtn}
            // onPress={() => navigation.navigate('ShareCardScreen', { cardData: item })}
            onPress={() =>
              navigation.navigate('ShareCardScreen', {
                cardData: {
                  ...item,
                  cardId: item.cardId ?? item.id
                }
              })
            }
            scaleTo={0.93}
          >
            <Ionicons name="share-social" size={15} color={GOLD} />
            <Text style={[styles.actionLabel, { color: GOLD }]}>Share</Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditCardScreen', { cardData: item })}
            scaleTo={0.93}
          >
            <Ionicons name="create-outline" size={15} color="#2F80ED" />
            <Text style={[styles.actionLabel, { color: '#2F80ED' }]}>Edit</Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.cardId ?? item.id)}
            scaleTo={0.93}
          >
            <Ionicons name="trash-outline" size={15} color="#EB5757" />
            <Text style={[styles.actionLabel, { color: '#EB5757' }]}>Delete</Text>
          </AnimatedPressable>
        </View>
      </TouchableOpacity>
    </AnimatedCard>
  ), [navigation, handleDelete, getCardId]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <Text style={styles.sectionTitle}>My Cards</Text>
      {loading ? (
        <View style={styles.listContent}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : cards.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="albums-outline" size={48} color={GOLD} />
          </View>
          <Text style={styles.emptyTitle}>No Cards Yet</Text>
          <Text style={styles.emptyText}>Create your first digital business card and manage it here</Text>
          <AnimatedPressable
            style={styles.emptyAction}
            onPress={() => navigation.navigate('PersonalDetails')}
          >
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.emptyActionText}>Create a Card</Text>
          </AnimatedPressable>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item, index) => String(item?.cardId ?? item?.id ?? `card-${index}`)}
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3E9D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  emptyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: GOLD,
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  emptyActionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
