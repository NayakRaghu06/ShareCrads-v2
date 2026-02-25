import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Loader({ size = 'large', color = '#000' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
});
