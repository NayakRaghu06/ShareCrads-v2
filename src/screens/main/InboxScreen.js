import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import AppHeader from '../../components/common/AppHeader';

const GOLD = '#C9A227';

function InboxScreen({ navigation }) {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrHydrateUserId = async () => {
    const storedUserId = await AsyncStorage.getItem('loggedInUserId');
    if (storedUserId) return storedUserId;

    const { res, data } = await apiFetch('/user/profile');
    if (!res.ok || !data?.data?.userId) return null;

    const fetchedUserId = String(data.data.userId);
    await AsyncStorage.setItem('loggedInUserId', fetchedUserId);
    return fetchedUserId;
  };

  useEffect(() => {
    loadInbox();
    const unsubscribe = navigation.addListener('focus', loadInbox);
    return unsubscribe;
  }, [navigation]);

  const loadInbox = async () => {
    try {
      setLoading(true);
      const userId = await getOrHydrateUserId();
      if (!userId) {
        navigation.replace('Login');
        return;
      }
      // GET /api/share/received/{userId}
      const { res, data } = await apiFetch(`/api/share/received/${userId}`);
      if (res.status === 401) {
        navigation.replace('Login');
        return;
      }
      setInbox(Array.isArray(data) ? data : []);
    } catch {
      setInbox([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (item) => {
    if (!item.viewedAt) {
      try {
        // PUT /api/share/view/{shareId}
        await apiFetch(`/api/share/view/${item.shareId}`, { method: 'PUT' });
      } catch {
        // non-blocking
      }
    }
    navigation.navigate('CardDetailsScreen', { cardData: item.card });
  };

  const formatTime = useCallback((iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }, []);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.viewedAt && styles.cardUnread]}
      onPress={() => handleOpen(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardRow}>
        <View style={styles.avatarWrap}>
          <Ionicons name="person-circle" size={48} color={GOLD} />
        </View>
        <View style={styles.info}>
          <Text style={styles.sender} numberOfLines={1}>
            {item.senderFirstName} {item.senderLastName}
          </Text>
          {item.senderCompany ? (
            <Text style={styles.company} numberOfLines={1}>{item.senderCompany}</Text>
          ) : null}
          {!item.viewedAt && <Text style={styles.newBadge}>New</Text>}
        </View>
        <Text style={styles.time}>{formatTime(item.sharedAt)}</Text>
      </View>
    </TouchableOpacity>
  ), [handleOpen, formatTime]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <FlatList
        data={inbox}
        keyExtractor={(item, index) => String(item?.shareId ?? item?.id ?? `share-${index}`)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={loadInbox}
        refreshing={loading}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={8}
        windowSize={5}
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>No cards received yet.</Text> : null
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

  /* Unread highlight */
  cardUnread: {
    borderColor: GOLD,
    borderWidth: 1.5,
  },

  /* New badge */
  newBadge: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: GOLD,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },

  /* Empty */
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
});
