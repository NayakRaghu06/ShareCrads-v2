import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ClassicTemplate from '../../components/templates/ClassicTemplate';
import ModernTemplate from '../../components/templates/ModernTemplate';
import DarkTemplate from '../../components/templates/DarkTemplate';
import COLORS from '../../styles/colors';

const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  dark: DarkTemplate,
};

export default function CardDetailsScreen({ route, navigation }) {
  const { cardData } = route.params;
  const SelectedComponent = TEMPLATE_COMPONENTS[cardData?.template] || ClassicTemplate;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 80,
          paddingHorizontal: 16
        }}
      >
        <SelectedComponent data={cardData} landscape />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, padding: 16 },
  backBtn: { padding: 4, marginRight: 8 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10
  },
  backText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold'
  },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.accent, flex: 1, textAlign: 'left' },
  cardPreview: {
    width: '100%',
    marginBottom: 18
  },
  detailsSection: { alignItems: 'center', paddingHorizontal: 20 },
  logo: { width: 64, height: 64, borderRadius: 32, marginBottom: 12 },
  initialCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  initialText: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 4 },
  company: { fontSize: 16, color: '#444', marginBottom: 2 },
  designation: { fontSize: 15, color: '#666', marginBottom: 2 },
  phone: { fontSize: 14, color: '#222', marginBottom: 2 },
  email: { fontSize: 14, color: '#222', marginBottom: 2 },
  website: { fontSize: 14, color: '#222', marginBottom: 2 },
  address: { fontSize: 14, color: '#222', marginBottom: 2 },
  social: { fontSize: 13, color: '#555', marginBottom: 2 },
});
