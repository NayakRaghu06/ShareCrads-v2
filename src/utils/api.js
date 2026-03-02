

export const BASE_URL = 'https://backend.sharecards.in';

// Default headers
export const defaultHeaders = {
  'Content-Type': 'application/json',
};

// ===============================
// COMMON FETCH WRAPPER
// ===============================

export const apiFetch = async (endpoint, options = {}) => {
  const headers = { ...defaultHeaders, ...(options.headers || {}) };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: 'include', // important for session cookies if used
      headers,
      ...options,
    });

    // Safely parse JSON (some endpoints may return empty body)
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      // Return raw text if JSON parse fails
      data = { raw: text };
    }

    return { res, data };
  } catch (err) {
    // Bubble network errors to caller with message
    throw new Error(err.message || 'Network request failed');
  }
};