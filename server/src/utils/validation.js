/**
 * Validation utilities for request inputs
 */

/**
 * Validate username format and length
 * @param {string} username - Username to validate
 * @returns {object} { valid: boolean, error?: string }
 */
export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: "Username is required" };
  }

  const sanitized = username.trim();
  
  if (sanitized.length < 3 || sanitized.length > 50) {
    return { valid: false, error: "Username must be between 3 and 50 characters" };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
    return { valid: false, error: "Username can only contain letters, numbers, underscores, and hyphens" };
  }

  return { valid: true, value: sanitized };
}

/**
 * Validate password format and length
 * @param {string} password - Password to validate
 * @param {string} fieldName - Field name for error messages (default: "Password")
 * @returns {object} { valid: boolean, error?: string }
 */
export function validatePassword(password, fieldName = "Password") {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (password.length < 6 || password.length > 128) {
    return { valid: false, error: `${fieldName} must be between 6 and 128 characters` };
  }

  return { valid: true };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} { valid: boolean, error?: string, value?: string }
 */
export function validateEmail(email) {
  if (!email || email.trim() === "") {
    return { valid: true, value: null }; // Email is optional
  }

  const sanitized = email.trim().toLowerCase();
  
  if (sanitized.length > 255) {
    return { valid: false, error: "Email is too long" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true, value: sanitized };
}

/**
 * Validate call ID format
 * @param {string} callId - Call ID to validate
 * @returns {object} { valid: boolean, error?: string, value?: string }
 */
export function validateCallId(callId) {
  if (!callId || typeof callId !== 'string') {
    return { valid: false, error: "Call ID is required" };
  }

  const sanitized = callId.trim();
  
  if (sanitized.length === 0 || sanitized.length > 255) {
    return { valid: false, error: "Invalid call ID" };
  }

  return { valid: true, value: sanitized };
}

/**
 * Validate user ID format
 * @param {string} userId - User ID to validate
 * @returns {object} { valid: boolean, error?: string }
 */
export function validateUserId(userId) {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return { valid: false, error: "User ID is required" };
  }

  return { valid: true };
}

