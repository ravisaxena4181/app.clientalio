import axios from 'axios';
import { auth } from '../utils/auth';

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/v1' 
  : 'https://apiclientalio.azurewebsites.net/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      auth.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Login
  login: async (credentials) => {
    try {
      // Convert email to username for API compatibility
      const payload = {
        Email: credentials.email,
        Password: credentials.password,
        usertype:"customer"
      };
      const response = await api.post('/Token', payload);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.response?.data || 
                      'Login failed. Please check your credentials.';
      throw typeof message === 'string' ? message : JSON.stringify(message);
    }
  },

  // Get testimonials
  getTestimonials: async () => {
    try {
      const response = await api.get('/testimonials');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch testimonials';
    }
  },

  // Create testimonial
  createTestimonial: async (data) => {
    try {
      const response = await api.post('/testimonials', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create testimonial';
    }
  },

  // Upload video
  uploadVideo: async (formData) => {
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to upload video';
    }
  },

  // Register Email
  registerEmail: async (data) => {
    try {
      const response = await api.post('/Customer/RegisterEmail', data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.response?.data || 
                      'Registration failed. Please try again.';
      throw typeof message === 'string' ? message : JSON.stringify(message);
    }
  },

  // Verify OTP
  verifyOTP: async (data) => {
    try {
      const response = await api.post('/Customer/VerifyEmail', data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.response?.data || 
                      'OTP verification failed.';
      throw typeof message === 'string' ? message : JSON.stringify(message);
    }
  },

  // Resend OTP
  resendOTP: async (data) => {
    try {
      const response = await api.post('/Customer/ResendOTP', data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.response?.data || 
                      'Failed to resend OTP.';
      throw typeof message === 'string' ? message : JSON.stringify(message);
    }
  },

  // Complete Onboarding
  completeOnboarding: async (formData) => {
    try {
      const response = await api.post('/Customer/CompleteSignup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.response?.data || 
                      'Failed to complete profile.';
      throw typeof message === 'string' ? message : JSON.stringify(message);
    }
  },
};

export default api;
