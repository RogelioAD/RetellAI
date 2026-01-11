import { hash } from "bcrypt";
import { User, CallRecord } from "../models/index.js";

// Retrieves all users from the database, excluding password hashes
export async function getAllUsers() {
  return await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    order: [["createdAt", "DESC"]],
  });
}

// Creates a new customer user account with hashed password
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
    password,
  };
}

// Deletes a user and all associated call records, with safety checks to prevent deleting admins or self
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

// Retrieves a user by ID, excluding password hash
export async function getUserById(userId) {
  return await User.findByPk(userId, {
    attributes: { exclude: ["passwordHash"] },
  });
}
