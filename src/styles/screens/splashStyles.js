import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: COLORS.accent,
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 120,
  },
  logo: {
    width: 220,
    height: 220,
  },
  appName: {
    color: COLORS.accent,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  tagline: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
