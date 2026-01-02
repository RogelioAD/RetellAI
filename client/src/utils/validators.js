/**
 * Form validation utilities
 */

export function validatePassword(password, minLength = 6) {
  if (!password) {
    return "Password is required";
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long`;
  }
  return null;
}

export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
}

export function validatePasswordChange(currentPassword, newPassword, confirmPassword) {
  if (!currentPassword || !newPassword || !confirmPassword) {
    return "All fields are required";
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return passwordError;
  }

  const matchError = validatePasswordMatch(newPassword, confirmPassword);
  if (matchError) {
    return matchError;
  }

  if (currentPassword === newPassword) {
    return "New password must be different from current password";
  }

  return null;
}

export function validateUserCreation(username, password, email = null) {
  if (!username || !password) {
    return "Username and password are required";
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return passwordError;
  }

  if (email && !email.includes("@")) {
    return "Invalid email format";
  }

  return null;
}

