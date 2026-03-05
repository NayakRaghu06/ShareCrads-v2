import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../styles/colors';
import { splashStyles } from '../../styles/screens/splashStyles';
import { getSession } from '../../utils/storage';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (!mounted) return;

        const [userPhone, session] = await Promise.all([
          AsyncStorage.getItem('userPhone'),
          getSession(),
        ]);

        const destination = userPhone || session ? 'Landing' : 'Login';
        navigation.reset({ index: 0, routes: [{ name: destination }] });
      } catch {
        if (mounted) {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      }
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
