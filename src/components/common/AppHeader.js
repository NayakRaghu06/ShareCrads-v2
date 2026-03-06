import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../styles/colors';

const AppHeader = () => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={COLORS.accent} />
        </TouchableOpacity>

        <Text style={styles.title}>DIGITAL BUSINESS CARD</Text>

        <View style={{ width: 36 }} />
      </View>

      <View style={styles.goldLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    width: '100%',
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.text,
    textAlign: 'center',
  },
  goldLine: {
    height: 2,
    width: '100%',
    backgroundColor: COLORS.accent,
  },
});

export default AppHeader;
