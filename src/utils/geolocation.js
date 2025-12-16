import axios from 'axios';

export const getClientInfo = async () => {
  try {
    // Get IP and location from ipapi.co
    const response = await axios.get('https://ipapi.co/json/');
    return {
      ip: response.data.ip,
      city: response.data.city,
      region: response.data.region,
      country: response.data.country_name,
      countryCode: response.data.country_code,
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
    };
  } catch (error) {
    console.error('Failed to get client info:', error);
    // Return default values if API fails
    return {
      ip: 'unknown',
      city: 'unknown',
      region: 'unknown',
      country: 'unknown',
      countryCode: 'unknown',
      latitude: 0,
      longitude: 0,
      timezone: 'unknown',
    };
  }
};
