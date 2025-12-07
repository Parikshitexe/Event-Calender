import { useState, useEffect } from 'react';
import { validateEventForm } from '../../utils/validation';
import { toUTCString, getStartOfDayUTC, getEndOfDayUTC } from '../../utils/dateHelpers';
import EventFormFields from './EventFormFields';

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
 */
const EventFormModal = ({ isOpen, mode, eventData, selectedDate, onClose, createEvent, updateEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!isSubmitting) {
      onClose();
    }
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <EventFormFields
              formData={formData}
              onChange={setFormData}
              errors={errors}
              initialDate={selectedDate}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventFormModal;

