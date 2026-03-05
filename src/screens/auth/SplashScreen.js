import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../styles/colors';
import { splashStyles } from '../../styles/screens/splashStyles';
<<<<<<< HEAD
=======
import { getSession } from '../../utils/storage';
>>>>>>> 0b042c43f4eaefd23cf4d00fc6fff725f55d685e

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    let mounted = true;

    const check = async () => {
<<<<<<< HEAD
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (!mounted) return;

      const userPhone = await AsyncStorage.getItem('userPhone');
      const destination = userPhone ? 'Landing' : 'Login';
      navigation.reset({ index: 0, routes: [{ name: destination }] });
=======
      try {
        const session = await getSession();
        setTimeout(() => {
          if (!mounted) return;
          if (session) {
            navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
          } else {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        }, 1500);
      } catch {
        if (mounted) {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      }
>>>>>>> 0b042c43f4eaefd23cf4d00fc6fff725f55d685e
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
