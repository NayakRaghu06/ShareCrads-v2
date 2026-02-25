import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const globalStyles = StyleSheet.create({
  // Flex utilities
  flex: {
    flex: 1,
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },

  // Padding & Margin
  p16: {
    padding: 16,
  },
  p20: {
    padding: 20,
  },
  m16: {
    margin: 16,
  },
  m20: {
    margin: 20,
  },

  // Text styles
  heading1: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.text,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500',
    color: '#999',
  },

  // Borders
  borderRadius12: {
    borderRadius: 12,
  },
  borderRadius16: {
    borderRadius: 16,
  },

  // Shadows
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
});

export default globalStyles;
