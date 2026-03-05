import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../styles/colors';
import { splashStyles } from '../../styles/screens/splashStyles';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    let mounted = true;

    const check = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (!mounted) return;

      const userPhone = await AsyncStorage.getItem('userPhone');
      const destination = userPhone ? 'Landing' : 'Login';
      navigation.reset({ index: 0, routes: [{ name: destination }] });
    };

    check();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <View style={splashStyles.container}>
      {/* Logo Circle */}
      <View style={splashStyles.circle}>
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={splashStyles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Tagline */}
      <Text style={splashStyles.tagline}>Grow your business digitally</Text>
    </View>
  );
}
