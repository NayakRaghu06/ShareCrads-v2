import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Convenience helpers: add/remove single card to dashboard
export const addDashboardCard = async (card) => {
  try {
    const data = await AsyncStorage.getItem('DASHBOARD');
    let cards = data ? JSON.parse(data) : [];
    if (!Array.isArray(cards)) cards = [];
    cards.push(card);
    await AsyncStorage.setItem('DASHBOARD', JSON.stringify(cards));
    return cards;
  } catch (e) {
    throw e;
  }
};

export const removeDashboardCard = async (index) => {
  try {
    const data = await AsyncStorage.getItem('DASHBOARD');
    let cards = data ? JSON.parse(data) : [];
    if (!Array.isArray(cards)) cards = [];
    if (index >= 0 && index < cards.length) {
      cards.splice(index, 1);
      await AsyncStorage.setItem('DASHBOARD', JSON.stringify(cards));
    }
    return cards;
  } catch (e) {
    throw e;
  }
};
