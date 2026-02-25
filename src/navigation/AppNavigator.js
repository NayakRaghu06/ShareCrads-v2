import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from '../screens/auth/SplashScreen';
import LocationPermissionScreen from '../screens/auth/LocationPermissionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import LandingScreen from '../screens/main/LandingScreen';
import UserDetailsScreen from '../screens/main/UserDetailsScreen';
// ...existing code...
import PersonalDetailsScreen from '../screens/main/PersonalDetailsScreen';
import BusinessDetailsScreen from '../screens/main/BusinessDetailsScreen';
import SocialMediaScreen from '../screens/main/SocialMediaScreen';
import TemplatePreviewScreen from '../screens/main/TemplatePreviewScreen';
import SelectTemplateScreen from '../screens/main/SelectTemplateScreen';
import FinalPreviewScreen from '../screens/main/FinalPreviewScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ContactsScreen from '../screens/main/ContactsScreen';
// onboarding screens removed

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ========== DASHBOARD TAB NAVIGATOR ==========
function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 2,
          borderTopColor: '#D4AF37',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={PersonalDetailsScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen}
        options={{
          tabBarLabel: 'Contacts',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

// ========== MAIN STACK NAVIGATOR ==========
export default function AppNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} />
      <Stack.Screen name="SocialMedia" component={SocialMediaScreen} />
      <Stack.Screen name="TemplatePreview" component={TemplatePreviewScreen} />
      <Stack.Screen name="SelectTemplate" component={SelectTemplateScreen} />
      <Stack.Screen name="FinalPreview" component={FinalPreviewScreen} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Dashboard" component={DashboardTabs} />
    </Stack.Navigator>
  );
}
