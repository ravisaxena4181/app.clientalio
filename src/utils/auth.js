// Authentication utility functions

const TOKEN_KEY = 'clientalio_token';
const USER_KEY = 'clientalio_user';

export const auth = {
  // Save token to localStorage
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Save user data
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get user data
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
