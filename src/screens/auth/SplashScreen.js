import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { COLORS } from '../../styles/colors';
import { splashStyles } from '../../styles/screens/splashStyles';
import { getUser } from '../../utils/storage';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    let mounted = true;

    const check = async () => {
      // Always send user to Login first; login flow will decide Landing vs Signup
      setTimeout(() => {
        if (!mounted) return;
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }, 1500);
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
