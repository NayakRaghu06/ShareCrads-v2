import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUser = async (user) => {
  await AsyncStorage.setItem('USER', JSON.stringify(user));
};

export const getUser = async () => {
  const data = await AsyncStorage.getItem('USER');
  return data ? JSON.parse(data) : null;
};

export const clearUser = async () => {
  await AsyncStorage.removeItem('USER');
};

// Card draft helpers: save/read temporary card data across steps
export const saveCardDraft = async (card) => {
  await AsyncStorage.setItem('CARD_DRAFT', JSON.stringify(card));
};

export const getCardDraft = async () => {
  const data = await AsyncStorage.getItem('CARD_DRAFT');
  return data ? JSON.parse(data) : {};
};

export const clearCardDraft = async () => {
  await AsyncStorage.removeItem('CARD_DRAFT');
};

// Dashboard data helpers
export const saveDashboard = async (dashboard) => {
  await AsyncStorage.setItem('DASHBOARD', JSON.stringify(dashboard));
};

export const getDashboard = async () => {
  const data = await AsyncStorage.getItem('DASHBOARD');
  return data ? JSON.parse(data) : null;
};

export const clearDashboard = async () => {
  await AsyncStorage.removeItem('DASHBOARD');
};
