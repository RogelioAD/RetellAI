import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { jwtSecret } from "../config.js";

/**
 * Authenticates a user with username and password and returns a JWT token.
 */
export async function authenticateUser(username, password) {
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const sanitizedUsername = String(username).trim();
  const user = await User.findOne({ where: { username: sanitizedUsername } });
  
  if (!user) {
    throw new Error("Invalid username or password");
  }

  const isValid = await compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "30d" });
  
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

/**
 * Changes a user's password after validating the current password.
 */
export async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (currentPassword === newPassword) {
    throw new Error("New password must be different from current password");
  }

  const isCurrentPasswordValid = await compare(currentPassword, user.passwordHash);
  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const newPasswordHash = await hash(newPassword, 10);
  user.passwordHash = newPasswordHash;
  await user.save();
}

