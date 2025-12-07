import { useState } from 'react';

/**
 * Custom hook for managing modal state
 * Handles opening/closing modals and storing modal data
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('create'); // 'create' or 'edit'
  const [eventData, setEventData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  /**
   * Open modal in create mode with optional selected date
   * @param {Date} date - Optional date to pre-fill in form
   */
  const openCreateModal = (date = null) => {
    setMode('create');
    setEventData(null);
    setSelectedDate(date);
    setIsOpen(true);
  };

  /**
   * Open modal in edit mode with event data
   * @param {Object} event - Event object to edit
   */
  const openEditModal = (event) => {
    setMode('edit');
    setEventData(event);
    setSelectedDate(null);
    setIsOpen(true);
  };

  /**
   * Close modal and reset state
   */
  const closeModal = () => {
    setIsOpen(false);
    setMode('create');
    setEventData(null);
    setSelectedDate(null);
  };

  return {
    isOpen,
    mode,
    eventData,
    selectedDate,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};

