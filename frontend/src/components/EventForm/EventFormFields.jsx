import { useState, useEffect } from 'react';
import { formatDate, formatDateTime, toUTCString, getStartOfDayUTC, getEndOfDayUTC } from '../../utils/dateHelpers';

/**
 * Event form fields component
 * Handles all form inputs and validation display
 * @param {Object} props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.onChange - Callback when form data changes
 * @param {Object} props.errors - Validation errors object
 * @param {Date} props.initialDate - Optional initial date to pre-fill
 */
const EventFormFields = ({ formData, onChange, errors, initialDate }) => {
  /**
   * Handle input change and update form data
   */
  const handleChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  /**
   * Handle all-day checkbox change
   * When checked, set times to start/end of day
   */
  const handleAllDayChange = (checked) => {
    if (checked) {
      const startDate = formData.start ? new Date(formData.start) : new Date();
      const endDate = formData.end ? new Date(formData.end) : new Date();
      
      // Set to start of day for start, end of day for end
      const start = getStartOfDayUTC(startDate);
      const end = getEndOfDayUTC(endDate);
      
      onChange({
        ...formData,
        allDay: true,
        start: toUTCString(start),
        end: toUTCString(end),
      });
    } else {
      onChange({
        ...formData,
        allDay: false,
      });
    }
  };

  /**
   * Get local datetime string for datetime-local input
   * Converts UTC to local time for display
   */
  const getLocalDateTimeString = (utcDateString) => {
    if (!utcDateString) return '';
    const date = new Date(utcDateString);
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  /**
   * Handle datetime-local input change
   * Converts local time to UTC for API
   */
  const handleDateTimeChange = (field, localDateTimeString) => {
    if (!localDateTimeString) {
      onChange({
        ...formData,
        [field]: '',
      });
      return;
    }

    // Create date from local datetime string and convert to UTC
    const localDate = new Date(localDateTimeString);
    onChange({
      ...formData,
      [field]: toUTCString(localDate),
    });
  };

  return (
    <div className="space-y-4">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter event title"
          maxLength={100}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter event description (optional)"
          rows={3}
          maxLength={500}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.description?.length || 0} / 500 characters
        </p>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* All-Day Checkbox */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.allDay || false}
            onChange={(e) => handleAllDayChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">All-day event</span>
        </label>
      </div>

      {/* Start Date/Time Field */}
      <div>
        <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
          Start <span className="text-red-500">*</span>
        </label>
        {formData.allDay ? (
          <input
            type="date"
            id="start"
            value={formData.start ? new Date(formData.start).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              if (e.target.value) {
                const date = new Date(e.target.value);
                date.setHours(0, 0, 0, 0);
                onChange({
                  ...formData,
                  start: toUTCString(date),
                });
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.start ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        ) : (
          <input
            type="datetime-local"
            id="start"
            value={getLocalDateTimeString(formData.start)}
            onChange={(e) => handleDateTimeChange('start', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.start ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )}
        {errors.start && (
          <p className="mt-1 text-sm text-red-600">{errors.start}</p>
        )}
      </div>

      {/* End Date/Time Field */}
      <div>
        <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
          End <span className="text-red-500">*</span>
        </label>
        {formData.allDay ? (
          <input
            type="date"
            id="end"
            value={formData.end ? new Date(formData.end).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              if (e.target.value) {
                const date = new Date(e.target.value);
                date.setHours(23, 59, 59, 999);
                onChange({
                  ...formData,
                  end: toUTCString(date),
                });
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.end ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        ) : (
          <input
            type="datetime-local"
            id="end"
            value={getLocalDateTimeString(formData.end)}
            onChange={(e) => handleDateTimeChange('end', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.end ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )}
        {errors.end && (
          <p className="mt-1 text-sm text-red-600">{errors.end}</p>
        )}
      </div>
    </div>
  );
};

export default EventFormFields;

