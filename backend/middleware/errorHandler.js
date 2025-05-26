// backend/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error('Unhandled Error:', err.stack || err); // Log the full error stack

  // Default error response
  let statusCode = err.statusCode || 500; // Use error's status code or default to 500
  let message = err.message || 'Internal Server Error';

  // Customize message for specific error types if needed
  if (err.name === 'UnauthorizedError') { // Example for express-jwt or similar, or express-oauth2-jwt-bearer
    statusCode = 401;
    message = 'Invalid or missing token.';
  } else if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    // Handle malformed JSON from client
    statusCode = 400;
    message = 'Malformed JSON in request body.';
  }
  // Mongoose Validation Error
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    // Collect specific field errors
    const fieldErrors = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }));
    message = 'Validation failed.';
    return res.status(statusCode).json({ message, errors: fieldErrors });
  }


  // Avoid sending detailed stack traces in production for security
  const errorResponse = { message };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    // errorResponse.stack = err.stack; // Optionally send stack in dev, but usually console.error is enough
  }

  res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;
