/**
 * Global error handler middleware
 * Catches all errors and returns consistent error response format
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: errors.join(', '),
    });
  }

  // Mongoose cast error (invalid ID format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid event ID format',
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

/**
 * 404 handler for undefined routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

