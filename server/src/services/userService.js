import { hash } from "bcrypt";
import { User, CallRecord } from "../models/index.js";

/**
 * Get all users (admin only)
 * @returns {Promise<Array>}
 */
export async function getAllUsers() {
  return await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    order: [["createdAt", "DESC"]],
  });
}

/**
 * Create a new customer user
 * @param {object} userData - User data (username, password, email)
 * @returns {Promise<{user: object, password: string}>}
 * @throws {Error} If user creation fails
 */
export async function createCustomer({ username, password, email }) {
  const sanitizedUsername = String(username).trim();
  const existing = await User.findOne({ where: { username: sanitizedUsername } });
  if (existing) {
    throw new Error("Username already taken");
  }

  let sanitizedEmail = null;
  if (email && email.trim() !== "") {
    sanitizedEmail = email.trim().toLowerCase();
  }

  const passwordHash = await hash(password, 10);
  const userData = {
    username: sanitizedUsername,
    passwordHash,
    role: "user",
    ...(sanitizedEmail && { email: sanitizedEmail }),
  };

  const user = await User.create(userData);
  
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    password, // Return plain password for admin display (only available at creation)
  };
}

/**
 * Delete a user and all associated call records
 * @param {string} userId - User ID to delete
 * @param {string} requestingUserId - ID of user making the request
 * @returns {Promise<{deletedUser: object, deletedCallRecords: number}>}
 * @throws {Error} If deletion fails
 */
export async function deleteUser(userId, requestingUserId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    throw new Error("Cannot delete admin users");
  }

  if (user.id === requestingUserId) {
    throw new Error("Cannot delete your own account");
  }

  const deletedCallRecords = await CallRecord.destroy({
    where: { userId: user.id },
  });

  await user.destroy();

  return {
    deletedUser: {
      id: user.id,
      username: user.username,
    },
    deletedCallRecords,
  };
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<object|null>}
 */
export async function getUserById(userId) {
  return await User.findByPk(userId, {
    attributes: { exclude: ["passwordHash"] },
  });
}

