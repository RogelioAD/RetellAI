// Centralized error handler middleware - catches errors and returns appropriate HTTP responses
export function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

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

  const status = err.statusCode || 500;
  const is4xx = status >= 400 && status < 500;
  const message = process.env.NODE_ENV === 'production'
    ? (is4xx ? (err.message || "Bad request") : "Server error")
    : (err.message || "Server error");

  res.status(status).json({ error: message });
}

// Wraps async route handlers to automatically catch errors and pass to error handler
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
