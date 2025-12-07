/**
 * Validation middleware for event creation and updates
 * Validates request body before processing
 */
export const validateEvent = (req, res, next) => {
  const { title, start, end, allDay } = req.body;

  // Check required fields
  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Title is required',
    });
  }

  if (title.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Title cannot exceed 100 characters',
    });
  }

  // Validate dates
  if (!start) {
    return res.status(400).json({
      success: false,
      error: 'Start date is required',
    });
  }

  if (!end) {
    return res.status(400).json({
      success: false,
      error: 'End date is required',
    });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  // Check if dates are valid
  if (isNaN(startDate.getTime())) {
    return res.status(400).json({
      success: false,
      error: 'Invalid start date format',
    });
  }

  if (isNaN(endDate.getTime())) {
    return res.status(400).json({
      success: false,
      error: 'Invalid end date format',
    });
  }

  // Check if end is after start
  if (endDate <= startDate) {
    return res.status(400).json({
      success: false,
      error: 'End date must be after start date',
    });
  }

  // Validate description if provided
  if (req.body.description && req.body.description.length > 500) {
    return res.status(400).json({
      success: false,
      error: 'Description cannot exceed 500 characters',
    });
  }

  // Validate allDay is boolean if provided
  if (allDay !== undefined && typeof allDay !== 'boolean') {
    return res.status(400).json({
      success: false,
      error: 'allDay must be a boolean value',
    });
  }

  next();
};

