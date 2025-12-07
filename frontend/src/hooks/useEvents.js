import { useState, useEffect, useCallback } from 'react';
import { eventAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing events state and CRUD operations
 * Handles loading states, errors, and provides functions for all event operations
 */
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch all events from the backend
   * Called on mount and can be called manually to refresh events
   */
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventAPI.getAll();
      setEvents(data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch events';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new event
   * @param {Object} eventData - Event data to create
   * @returns {Promise} Created event
   */
  const createEvent = useCallback(async (eventData) => {
    try {
      const newEvent = await eventAPI.create(eventData);
      setEvents((prev) => [...prev, newEvent]);
      toast.success('Event created successfully');
      return newEvent;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create event';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Update an existing event
   * @param {string} id - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise} Updated event
   */
  const updateEvent = useCallback(async (id, eventData) => {
    try {
      const updatedEvent = await eventAPI.update(id, eventData);
      setEvents((prev) =>
        prev.map((event) => (event._id === id ? updatedEvent : event))
      );
      toast.success('Event updated successfully');
      return updatedEvent;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update event';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Delete an event
   * @param {string} id - Event ID to delete
   * @returns {Promise} Deleted event
   */
  const deleteEvent = useCallback(async (id) => {
    try {
      await eventAPI.delete(id);
      setEvents((prev) => prev.filter((event) => event._id !== id));
      toast.success('Event deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete event';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};

