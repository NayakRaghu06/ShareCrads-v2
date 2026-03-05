import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { apiFetch } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import AnimatedCard from '../../components/common/AnimatedCard';

const GOLD = '#C9A227';

export default function MyCardsScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

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
<<<<<<< HEAD
            // Update state locally instead of re-fetching the whole list
            setCards(prev => prev.filter(c => c.cardId !== cardId));
=======
            loadCards();
>>>>>>> d171760491f43f3850cd94873005649dfb52af06
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
          onPress={() => navigation.navigate('EditCardScreen', { cardData: item })}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={15} color="#2F80ED" />
          <Text style={[styles.actionLabel, { color: '#2F80ED' }]}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.cardId)}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={15} color="#EB5757" />
          <Text style={[styles.actionLabel, { color: '#EB5757' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    </AnimatedCard>
  ), [navigation, handleDelete]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
<<<<<<< HEAD

      

=======
      <Text style={styles.sectionTitle}>My Cards</Text>
>>>>>>> d171760491f43f3850cd94873005649dfb52af06
      {loading ? null : cards.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="albums-outline" size={64} color={GOLD} />
          <Text style={styles.emptyText}>No saved cards yet</Text>
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
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 14,
  },
});
