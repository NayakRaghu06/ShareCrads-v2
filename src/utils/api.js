import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://backend.sharecards.in';

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

// ─────────────────────────────────────────────
//  Session cookie helpers
//  React Native fetch does NOT persist cookies automatically.
//  We manually capture Set-Cookie after login and forward it on every request.
// ─────────────────────────────────────────────
const SESSION_COOKIE_KEY = 'sessionCookie';

export const getSessionCookie = () => AsyncStorage.getItem(SESSION_COOKIE_KEY);

export const saveSessionCookie = (cookie) =>
  AsyncStorage.setItem(SESSION_COOKIE_KEY, cookie);

export const clearSessionCookie = () =>
  AsyncStorage.removeItem(SESSION_COOKIE_KEY);

// ─────────────────────────────────────────────
//  Core fetch wrapper
// ─────────────────────────────────────────────
export const apiFetch = async (endpoint, options = {}) => {
  // Forward stored session cookie on every request
  const storedCookie = await AsyncStorage.getItem(SESSION_COOKIE_KEY);
  const headers = {
    ...defaultHeaders,
    ...(storedCookie ? { Cookie: storedCookie } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: 'include',
      headers,
      ...options,
    });

    // Capture Set-Cookie from response and persist it
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      // Store only the cookie value portion (before the first ';')
      const cookieValue = setCookie.split(';')[0].trim();
      if (cookieValue) {
        await AsyncStorage.setItem(SESSION_COOKIE_KEY, cookieValue);
      }
    }

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = { raw: text };
    }
    return { res, data };
  } catch (err) {
    throw new Error(err.message || 'Network request failed');
  }
};


// ════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════

export const sendPhoneOtp = (mobileNumber) =>
  apiFetch('/auth/mobile-signup', {
    method: 'POST',
    body: JSON.stringify({ mobileNumber: Number(mobileNumber) }),
  });

export const verifyPhoneOtp = (mobileNumber, otp) =>
  apiFetch('/auth/verify-phone-otp', {
    method: 'POST',
    body: JSON.stringify({ mobileNumber: Number(mobileNumber), otp }),
  });

export const sendEmailOtp = (email) =>
  apiFetch('/auth/send-email-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const verifyEmailOtp = (email, otp) =>
  apiFetch('/auth/verify-email-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });

// ✅ FIX: was /auth/register → correct is /auth/final-submit
export const finalSignup = (firstName, middleName, lastName, mobileNumber, email) =>
  apiFetch('/auth/final-submit', {
    method: 'POST',
    body: JSON.stringify({
      firstName,
      middleName,
      lastName,
      mobileNumber: Number(mobileNumber),
      email: email?.trim() || null,
    }),
  });

// ✅ FIX: resend was calling /auth/resend/login-otp (doesn't exist) → use this for both send & resend
export const sendLoginOtp = (mobileNumber) =>
  apiFetch('/auth/mobile/login', {
    method: 'POST',
    body: JSON.stringify({ mobileNumber: Number(mobileNumber) }),
  });

export const verifyLoginOtp = (mobileNumber, otp) =>
  apiFetch('/auth/login/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ mobileNumber: Number(mobileNumber), otp }),
  });

// ✅ FIX: screens were calling /user/logout → correct is /auth/logout
export const logout = () =>
  apiFetch('/auth/logout', { method: 'POST' });


// ════════════════════════════════════════════
//  PROFILE
// ════════════════════════════════════════════

export const getProfile = () =>
  apiFetch('/user/profile');

export const updateProfile = (profileData) =>
  apiFetch('/user/update-profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });


// ════════════════════════════════════════════
//  BUSINESS CARD  (/api/cards)
// ════════════════════════════════════════════

export const createCard = (cardData) =>
  apiFetch('/api/cards/business-card', {
    method: 'POST',
    body: JSON.stringify(cardData),
  });

export const getMyCards = () =>
  apiFetch('/api/cards/view-cards');

export const updateCard = (cardId, cardData) =>
  apiFetch(`/api/cards/update-card/${cardId}`, {
    method: 'PUT',
    body: JSON.stringify(cardData),
  });

export const deleteCard = (cardId) =>
  apiFetch(`/api/cards/delete-card/${cardId}`, { method: 'DELETE' });

export const getCardById = (cardId) =>
  apiFetch(`/cards/${cardId}`);


// ════════════════════════════════════════════
//  SHARE  (/api/share)
// ════════════════════════════════════════════

export const checkUser = (mobileNumber) =>
  apiFetch(`/api/share/check-user?mobileNumber=${mobileNumber}`);

export const shareCardInApp = (senderId, receiverMobile, cardId) =>
  apiFetch('/api/share', {
    method: 'POST',
    body: JSON.stringify({
      senderId: Number(senderId),
      receiverMobile: Number(receiverMobile),
      cardId: Number(cardId),
    }),
  });

export const shareCardWhatsApp = (senderId, receiverMobile, cardId) =>
  apiFetch('/api/share/whatsapp', {
    method: 'POST',
    body: JSON.stringify({
      senderId: Number(senderId),
      receiverMobile: Number(receiverMobile),
      cardId: Number(cardId),
    }),
  });

export const getReceivedCards = (userId) =>
  apiFetch(`/api/share/received/${userId}`);

export const markCardViewed = (shareId) =>
  apiFetch(`/api/share/view/${shareId}`, { method: 'PUT' });

export const unshareCard = (shareId, userId) =>
  apiFetch(`/api/share/unshare/${shareId}?userId=${userId}`, { method: 'PUT' });


// ════════════════════════════════════════════
//  AsyncStorage helpers
// ════════════════════════════════════════════

export const getStoredUserId = () => AsyncStorage.getItem('loggedInUserId');
export const getStoredCardId = () => AsyncStorage.getItem('activeCardId');
export const getStoredPhone  = () => AsyncStorage.getItem('userPhone');

export const saveLoginSession = async (userId, phone) => {
  await AsyncStorage.setItem('loggedInUserId', String(userId));
  await AsyncStorage.setItem('userPhone', String(phone));
};

export const clearLoginSession = async () => {
  await AsyncStorage.multiRemove(['loggedInUserId', 'userPhone', 'activeCardId', SESSION_COOKIE_KEY]);
};

// Named helpers used by share APIs
export const saveUserId = (userId) =>
  AsyncStorage.setItem('loggedInUserId', String(userId));

export const getUserId = () =>
  AsyncStorage.getItem('loggedInUserId');

export const clearUserId = () =>
  AsyncStorage.removeItem('loggedInUserId');