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
});

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

