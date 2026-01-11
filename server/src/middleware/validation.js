import { validateUsername, validatePassword, validateEmail, validateCallId, validateUserId } from "../utils/validation.js";

// Express middleware to validate login request body (username and password)
export function validateLogin(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return res.status(400).json({ error: usernameValidation.error });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.error });
  }

  req.body.username = usernameValidation.value;
  next();
}

// Express middleware to validate password change request body
export function validateChangePassword(req, res, next) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required" });
  }

  const passwordValidation = validatePassword(newPassword, "New password");
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.error });
  }

  next();
}

// Express middleware to validate customer creation request body
export function validateCreateCustomer(req, res, next) {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username & password required" });
  }

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return res.status(400).json({ error: usernameValidation.error });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.error });
  }

  if (email !== undefined) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ error: emailValidation.error });
    }
    req.body.email = emailValidation.value;
  }

  req.body.username = usernameValidation.value;
  next();
}

// Express middleware to validate userId parameter from URL
export function validateUserIdParam(req, res, next) {
  const validation = validateUserId(req.params.userId);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  next();
}

// Express middleware to validate webhook payload structure and call ID
export function validateWebhookPayload(req, res, next) {
  const event = req.body;
  
  if (!event || typeof event !== 'object') {
    return res.status(400).json({ error: "Invalid webhook payload" });
  }

  if (!event.id) {
    return res.status(400).json({ error: "missing call id" });
  }

  const callIdValidation = validateCallId(event.id);
  if (!callIdValidation.valid) {
    return res.status(400).json({ error: callIdValidation.error });
  }

  req.body.id = callIdValidation.value;
  next();
}
