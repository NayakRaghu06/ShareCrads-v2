import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getAllSavedCards, deleteSavedCard } from '../../database/userQueries';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../styles/colors';

export default function MyCardsScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const dbCards = await getAllSavedCards();
        setCards(dbCards || []);
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

  const handleDelete = async (id) => {
    await deleteSavedCard(id);
    setCards(cards.filter(card => card.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardItem}>
      {item.savedImage ? (
        <Image source={{ uri: item.savedImage }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name || 'Unnamed'}</Text>
        <Text style={styles.designation}>{item.designation || ''}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color="#b71c1c" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={COLORS.accent} />
        </TouchableOpacity>
        <Text style={styles.title}>My Cards</Text>
        <View style={{ width: 32 }} />
      </View>
      {loading ? null : cards.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="albums-outline" size={60} color={COLORS.accent} />
          <Text style={styles.emptyText}>No saved cards yet</Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  backBtn: { padding: 4, marginRight: 8 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.accent, flex: 1, textAlign: 'left' },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  image: { width: 54, height: 54, borderRadius: 8, marginRight: 14 },
  imagePlaceholder: { width: 54, height: 54, borderRadius: 8, marginRight: 14, backgroundColor: '#e0e0e0' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#111' },
  designation: { fontSize: 13, color: '#666', marginTop: 4 },
  deleteBtn: { padding: 6 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: '#888', marginTop: 16 },
});
