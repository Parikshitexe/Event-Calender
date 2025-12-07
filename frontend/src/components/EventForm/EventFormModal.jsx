import { useState, useEffect } from 'react';
import { validateEventForm } from '../../utils/validation';
import { toUTCString, getStartOfDayUTC, getEndOfDayUTC } from '../../utils/dateHelpers';
import EventFormFields from './EventFormFields';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * Event form modal component
 * Handles both create and edit modes
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {string} props.mode - 'create' or 'edit'
 * @param {Object} props.eventData - Event data for edit mode
 * @param {Date} props.selectedDate - Selected date for create mode
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} props.createEvent - Function to create event
 * @param {Function} props.updateEvent - Function to update event
 * @param {Function} props.deleteEvent - Function to delete event
 */
const EventFormModal = ({ isOpen, mode, eventData, selectedDate, onClose, createEvent, updateEvent, deleteEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Check if the start date is in the past
   * @returns {boolean} True if start date is earlier than today/now
   */
  const isPastDate = () => {
    if (!formData.start) return false;
    
    const startDate = new Date(formData.start);
    const now = new Date();
    
    if (formData.allDay) {
      // For all-day events, compare just the date (ignore time)
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startDateOnly < todayOnly;
    } else {
      // For timed events, allow a 1-minute buffer to account for slight time differences
      // This prevents false positives when creating events for "now"
      const buffer = 60 * 1000; // 1 minute in milliseconds
      return startDate < (now - buffer);
    }
  };

  /**
   * Initialize form data based on mode
   */
  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        title: '',
        description: '',
        start: '',
        end: '',
        allDay: false,
      });
      setErrors({});
      return;
    }

    if (mode === 'edit' && eventData) {
      // Edit mode: populate form with event data
      setFormData({
        title: eventData.title || '',
        description: eventData.description || '',
        start: eventData.start || '',
        end: eventData.end || '',
        allDay: eventData.allDay || false,
      });
    } else if (mode === 'create') {
      // Create mode: initialize with selected date or current date/time
      const startDate = selectedDate || new Date();
      const endDate = selectedDate ? new Date(selectedDate.getTime() + 60 * 60 * 1000) : new Date(Date.now() + 60 * 60 * 1000); // +1 hour

      setFormData({
        title: '',
        description: '',
        start: toUTCString(startDate),
        end: toUTCString(endDate),
        allDay: false,
      });
    }
    setErrors({});
  }, [isOpen, mode, eventData, selectedDate]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateEventForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare data for API
      const submitData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        start: formData.start,
        end: formData.end,
        allDay: formData.allDay || false,
      };

      if (mode === 'create') {
        await createEvent(submitData);
      } else if (mode === 'edit' && eventData) {
        await updateEvent(eventData._id, submitData);
      }

      // Close modal on success
      onClose();
    } catch (error) {
      // Error is already handled by useEvents hook (toast notification)
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (!isSubmitting && !isDeleting) {
      onClose();
    }
  };

  /**
   * Handle delete button click - show confirmation dialog
   */
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async () => {
    if (!eventData || !eventData._id) return;

    setIsDeleting(true);
    setShowDeleteConfirm(false);

    try {
      await deleteEvent(eventData._id);
      // Close modal on success
      onClose();
    } catch (error) {
      // Error is already handled by useEvents hook (toast notification)
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle delete cancellation
   */
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {mode === 'create' ? 'Create Event' : 'Edit Event'}
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Past Date Warning - Only show in create mode */}
          {mode === 'create' && isPastDate() && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-yellow-800 font-medium">
                  You are creating an event in the past.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <EventFormFields
              formData={formData}
              onChange={setFormData}
              errors={errors}
              initialDate={selectedDate}
            />

            {/* Buttons */}
            <div className="flex justify-between items-center mt-6">
              {/* Delete button - only show in edit mode */}
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={isSubmitting || isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              )}
              {mode === 'create' && <div></div>}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting || isDeleting}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isDeleting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Event"
        message={`Are you sure you want to delete "${eventData?.title || 'this event'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDestructive={true}
      />
    </div>
  );
};

export default EventFormModal;

