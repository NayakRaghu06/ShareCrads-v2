import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getDashboard, removeDashboardCard } from '../../utils/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../styles/colors';

export default function MyCardsScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cards from AsyncStorage on mount and when screen is focused
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

  // Landscape Card View
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.cardItem}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('CardDetailsScreen', { cardData: item })}
    >
      {item.savedImage ? (
        <Image source={{ uri: item.savedImage }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name || 'Unnamed'}</Text>
        <Text style={styles.company}>{item.companyName || item.company || ''}</Text>
        <Text style={styles.phone}>{item.phone || ''}</Text>
        <Text style={styles.email}>{item.email || ''}</Text>
        <Text style={styles.template}>{item.template || ''}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditCardScreen", {
              cardData: item,
              cardIndex: index
            })
          }
          style={styles.editBtn}
        >
          <Ionicons name="create-outline" size={20} color="#1976d2" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(index)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={20} color="#b71c1c" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
          keyExtractor={(_, idx) => idx.toString()}
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
  company: { fontSize: 13, color: '#666', marginTop: 2 },
  phone: { fontSize: 12, color: '#444', marginTop: 2 },
  email: { fontSize: 12, color: '#444', marginTop: 2 },
  template: { fontSize: 11, color: '#888', marginTop: 2 },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  editBtn: {
    padding: 6,
    marginRight: 10
  },
  deleteBtn: { padding: 6 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: '#888', marginTop: 16 },
});
