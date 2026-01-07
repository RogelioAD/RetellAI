/**
 * Centralized error handling middleware
 */

/**
 * Error handler middleware
 * Should be added after all routes
 */
export function errorHandler(err, req, res, next) {
  // Log error for debugging (only in development or log to external service in production)
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Handle known error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'UnauthorizedError' || err.message?.includes('token')) {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors?.[0]?.message || "Validation error" });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: "Resource already exists" });
  }

  // Default to 500 for unknown errors
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? "Server error" 
    : err.message || "Server error";

  res.status(err.statusCode || 500).json({ error: message });
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

