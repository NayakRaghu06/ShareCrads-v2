import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../styles/colors';

const PrimaryButton = ({ title, onPress, variant = 'primary', disabled = false }) => {
  const filled = variant === 'primary';
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, filled ? styles.filled : styles.outlined, disabled && styles.disabled]}
    >
      <Text style={[styles.title, filled ? styles.titleFilled : styles.titleOutlined, disabled && styles.titleDisabled]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  filled: {
    backgroundColor: COLORS.accent,
  },
  outlined: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  titleFilled: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  titleOutlined: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  titleDisabled: {
    opacity: 0.7,
  },
});

export default PrimaryButton;
