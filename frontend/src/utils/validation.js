/**
 * Form validation utilities
 * Validates event form data before submission
 */

/**
 * Validate event form data
 * @param {Object} formData - Form data object
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateEventForm = (formData) => {
  const errors = {};

  // Title validation (required, 1-100 chars)
  if (!formData.title || formData.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (formData.title.trim().length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  // Description validation (optional, max 500 chars)
  if (formData.description && formData.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  // Start date validation
  if (!formData.start) {
    errors.start = 'Start date is required';
  } else if (isNaN(new Date(formData.start).getTime())) {
    errors.start = 'Invalid start date';
  }

  // End date validation
  if (!formData.end) {
    errors.end = 'End date is required';
  } else if (isNaN(new Date(formData.end).getTime())) {
    errors.end = 'Invalid end date';
  }

  // End must be after start
  if (formData.start && formData.end) {
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);
    if (endDate <= startDate) {
      errors.end = 'End date must be after start date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

