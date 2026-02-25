import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../colors';

const { width } = Dimensions.get('window');

export const loginStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
  },

  header: {
    height: 240,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  iconWrap: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 14,
    borderRadius: 40,
    marginBottom: 12,
  },
  icon: {
    fontSize: 28,
  },
  appTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    fontSize: 13,
  },

  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 16,
    padding: 18,
    elevation: 3,
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  otpBox: {
    width: width / 8,
    height: 48,
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '700',
  },
  resendWrap: {
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    color: COLORS.accent,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.accent,
  },
  newHereText: {
    marginHorizontal: 12,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '500',
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  signupText: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  loginBtn: {
    backgroundColor: COLORS.accent,
    marginTop: 10,
  },
});
