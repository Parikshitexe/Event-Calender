import axios from 'axios';

/**
 * Axios instance configured with base URL from environment variables
 * All API calls will use this instance
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging (optional, can be removed in production)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout. Please check your connection.';
      } else if (error.message === 'Network Error') {
        error.message = 'Network error. Please check if the server is running.';
      } else {
        error.message = 'Unable to connect to server. Please try again later.';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * API service functions for event operations
 * All functions return promises that resolve to the API response data
 */
export const eventAPI = {
  /**
   * Get all events from the backend
   * @returns {Promise} Array of events
   */
  getAll: async () => {
    const response = await api.get('/api/events');
    return response.data.data;
  },

  /**
   * Create a new event
   * @param {Object} eventData - Event data (title, description, start, end, allDay)
   * @returns {Promise} Created event object
   */
  create: async (eventData) => {
    const response = await api.post('/api/events', eventData);
    return response.data.data;
  },

  /**
   * Update an existing event
   * @param {string} id - Event ID (MongoDB _id)
   * @param {Object} eventData - Updated event data
   * @returns {Promise} Updated event object
   */
  update: async (id, eventData) => {
    const response = await api.put(`/api/events/${id}`, eventData);
    return response.data.data;
  },

  /**
   * Delete an event
   * @param {string} id - Event ID (MongoDB _id)
   * @returns {Promise} Deleted event object
   */
  delete: async (id) => {
    const response = await api.delete(`/api/events/${id}`);
    return response.data.data;
  },
};

export default api;

