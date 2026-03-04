import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AppHeader = () => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#C9A227" />
        </TouchableOpacity>

        <Text style={styles.title}>DIGITAL BUSINESS CARD</Text>

        <View style={{ width: 26 }} />
      </View>

      <View style={styles.goldLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 90,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backBtn: {
    padding: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#000',
    textAlign: 'center',
  },
  goldLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#C9A227',
  },
});

export default AppHeader;
