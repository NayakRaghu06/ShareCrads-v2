import { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
<<<<<<< HEAD
=======
import shareCardAsVCard from '../../utils/shareVCard';
>>>>>>> 984f61d2886af1bcbdeb231ae92f08cbf8fcdcf1
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import websocketService from '../../utils/websocketService';
import AppHeader from '../../components/common/AppHeader';
import AnimatedCard from '../../components/common/AnimatedCard';

const GOLD = '#C9A227';

// ── Animated empty state ────────────────────────────────────────────────────
const EmptyState = () => {
  const bounce = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Gentle float loop on the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -10, duration: 1400, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0,   duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [bounce, opacity]);

  return (
    <Animated.View style={[emptyStyles.wrap, { opacity }]}>
      <Animated.View style={{ transform: [{ translateY: bounce }] }}>
        <View style={emptyStyles.iconCircle}>
          <Ionicons name="mail-open-outline" size={46} color={GOLD} />
        </View>
      </Animated.View>
      <Text style={emptyStyles.title}>No cards received yet</Text>
      <Text style={emptyStyles.subtitle}>
        When someone shares a card with you it will appear here.
      </Text>
    </Animated.View>
  );
};

const emptyStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 60,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FDF6E3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F3E9D2',
    marginBottom: 24,
    shadowColor: GOLD,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 21,
  },
});

// ── Main screen ─────────────────────────────────────────────────────────────
function InboxScreen({ navigation }) {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newArrivalCount, setNewArrivalCount] = useState(0);
  const [badgeScale] = useState(new Animated.Value(1));

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

<<<<<<< HEAD

=======
>>>>>>> 984f61d2886af1bcbdeb231ae92f08cbf8fcdcf1
  // Subscribe to user-specific inbox queue for real-time shares
  useEffect(() => {
    let unsubscribe = null;

    getOrHydrateUserId().then(async (userId) => {
      if (!userId) return;

      await websocketService.connect(userId);
      unsubscribe = websocketService.subscribeToInbox((payload) => {
        const incomingItem = payload?.data || payload;
        if (!incomingItem) return;

        Animated.sequence([
          Animated.spring(badgeScale, { toValue: 1.2, useNativeDriver: true }),
          Animated.spring(badgeScale, { toValue: 1, useNativeDriver: true }),
        ]).start();

        setNewArrivalCount((prev) => prev + 1);

        setInbox((prev) => {
          // Avoid duplicates if both REST and socket deliver the same item
          const exists = prev.some(
            (i) => i.shareId && incomingItem.shareId && i.shareId === incomingItem.shareId
          );
          if (exists) return prev;
          return [incomingItem, ...prev];
        });
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [badgeScale]);
<<<<<<< HEAD

=======
>>>>>>> 984f61d2886af1bcbdeb231ae92f08cbf8fcdcf1

  const loadInbox = async () => {
    try {
      setLoading(true);
      const userId = await getOrHydrateUserId();
      if (!userId) { navigation.replace('Login'); return; }

      const { res, data } = await apiFetch(`/api/share/received/${userId}`);
      if (res.status === 401) { navigation.replace('Login'); return; }
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
        await apiFetch(`/api/share/view/${item.shareId}`, { method: 'PUT' });
      } catch {
        // non-blocking
      }
    }
    navigation.navigate('CardDetailsScreen', { cardData: item.card });
  };

  const handleSaveContact = async (item) => {
    if (!item.card) {
      Alert.alert('Error', 'No card data available to save.');
      return;
    }
    try {
      await shareCardAsVCard(item.card);
    } catch (e) {
      Alert.alert('Error', 'Could not save contact.');
    }
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

  // ── Staggered list item ─────────────────────────────────────────────────────
  const renderItem = useCallback(({ item, index }) => (
    <AnimatedCard index={index}>
      <View style={[styles.card, !item.viewedAt && styles.cardUnread]}>
        {/* Top row: avatar + info + time */}
        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => handleOpen(item)}
          activeOpacity={0.85}
        >
          {/* Avatar */}
          <View style={[styles.avatarWrap, !item.viewedAt && styles.avatarWrapUnread]}>
            <Ionicons name="person-circle" size={46} color={GOLD} />
            {!item.viewedAt && <View style={styles.unreadDot} />}
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.sender} numberOfLines={1}>
              {item.senderFirstName} {item.senderLastName}
            </Text>
            {item.senderCompany ? (
              <Text style={styles.company} numberOfLines={1}>{item.senderCompany}</Text>
            ) : null}
            {!item.viewedAt && (
              <View style={styles.newBadgeWrap}>
                <Text style={styles.newBadge}>New</Text>
              </View>
            )}
          </View>

          {/* Time */}
          <View style={styles.metaCol}>
            <Text style={styles.time}>{formatTime(item.sharedAt)}</Text>
          </View>
        </TouchableOpacity>

        {/* Action buttons row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtnView}
            onPress={() => handleOpen(item)}
            activeOpacity={0.85}
          >
            <Ionicons name="eye-outline" size={15} color="#fff" />
            <Text style={styles.actionBtnTextView}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnSave}
            onPress={() => handleSaveContact(item)}
            activeOpacity={0.85}
          >
            <Ionicons name="person-add-outline" size={15} color={GOLD} />
            <Text style={styles.actionBtnTextSave}>Save Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedCard>
  ), [handleOpen, handleSaveContact, formatTime]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      {newArrivalCount > 0 && (
        <Animated.View style={[styles.liveBadge, { transform: [{ scale: badgeScale }] }]}>
          <Ionicons name="notifications" size={14} color="#fff" />
          <Text style={styles.liveBadgeText}> {newArrivalCount} new</Text>
        </Animated.View>
      )}

      <FlatList
        data={inbox}
        keyExtractor={(item, index) => String(item?.shareId ?? item?.id ?? `share-${index}`)}
        contentContainerStyle={[styles.listContent, inbox.length === 0 && styles.listContentEmpty]}
        showsVerticalScrollIndicator={false}
        onRefresh={loadInbox}
        refreshing={loading}
        onScrollBeginDrag={() => setNewArrivalCount(0)}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={8}
        windowSize={5}
        ListEmptyComponent={!loading ? <EmptyState /> : null}
      />
    </SafeAreaView>
  );
}

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  // ── List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flexGrow: 1,
  },

  // ── Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0EADA',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardUnread: {
    borderColor: GOLD,
    borderWidth: 1.5,
    backgroundColor: '#FFFDF5',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ── Avatar
  avatarWrap: {
    marginRight: 12,
    position: 'relative',
  },
  avatarWrapUnread: {},
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GOLD,
    borderWidth: 1.5,
    borderColor: '#fff',
  },

  // ── Info
  info: {
    flex: 1,
  },
  sender: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  company: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  newBadgeWrap: {
    alignSelf: 'flex-start',
  },
  newBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: GOLD,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },

  // ── Time column
  metaCol: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  time: {
    fontSize: 12,
    color: GOLD,
    fontWeight: '600',
  },

  // ── Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0EADA',
  },
  actionBtnView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
    borderRadius: 8,
    paddingVertical: 9,
    gap: 5,
    elevation: 1,
  },
  actionBtnTextView: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  actionBtnSave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF6E3',
    borderRadius: 8,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: '#E6D7A3',
    gap: 5,
  },
  actionBtnTextSave: {
    color: GOLD,
    fontSize: 13,
    fontWeight: '700',
  },
  liveBadge: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 6,
    backgroundColor: GOLD,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
