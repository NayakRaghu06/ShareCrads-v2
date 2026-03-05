import { useRef, useCallback } from 'react';
import { Animated, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../styles/colors';

const PrimaryButton = ({ title, onPress, variant = 'primary', disabled = false }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const filled = variant === 'primary';

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 6,
    }).start();
  }, [scale]);

  return (
    <TouchableWithoutFeedback
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          filled ? styles.filled : styles.outlined,
          disabled && styles.disabled,
          { transform: [{ scale }] },
        ]}
      >
        <Text style={[styles.title, filled ? styles.titleFilled : styles.titleOutlined, disabled && styles.titleDisabled]}>
          {title}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
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
