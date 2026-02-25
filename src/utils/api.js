

export const BASE_URL = 'https://dbc.venturebiz.in';

// Default headers
export const defaultHeaders = {
  'Content-Type': 'application/json',
};

// ===============================
// COMMON FETCH WRAPPER
// ===============================

export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: 'include', // ⭐ IMPORTANT FOR SESSION
    headers: defaultHeaders,
    ...options,
  });

  const data = await res.json();

  return { res, data };
};