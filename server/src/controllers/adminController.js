import { getAllUsers, createCustomer, deleteUser } from "../services/userService.js";
import { linkCallsByAgent, refreshAgentNames } from "../services/callService.js";

/**
 * Returns all users (admin only).
 */
export async function getUsers(req, res) {
  const users = await getAllUsers();
  res.json({ users });
}

/**
 * Creates a new customer user and returns credentials.
 */
export async function createUser(req, res) {
  const { username, password, email } = req.body;
  const result = await createCustomer({ username, password, email });
  
  res.json({
    user: result.user,
    password: result.password,
    message: "User created successfully. Save these credentials - the password cannot be retrieved later.",
  });
}

/**
 * Deletes a user and all associated data (admin only).
 */
export async function deleteUserById(req, res) {
  const { userId } = req.params;
  const result = await deleteUser(userId, req.user.id);
  
  res.json({
    message: "User and all associated data deleted successfully",
    deletedUser: result.deletedUser,
    deletedCallRecords: result.deletedCallRecords,
  });
}

/**
 * Links existing calls to users based on agent_name matching username.
 */
export async function linkCalls(req, res) {
  const result = await linkCallsByAgent();
  res.json(result);
}

/**
 * Re-fetches all calls from RetellAI and updates agent names.
 */
export async function refreshAgents(req, res) {
  const result = await refreshAgentNames();
  res.json(result);
}

