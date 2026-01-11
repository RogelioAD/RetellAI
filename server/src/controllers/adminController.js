import { getAllUsers, createCustomer, deleteUser } from "../services/userService.js";
import { linkCallsByAgent, refreshAgentNames } from "../services/callService.js";

// HTTP handler for getting all users (admin only)
export async function getUsers(req, res) {
  const users = await getAllUsers();
  res.json({ users });
}

// HTTP handler for creating a new customer user (admin only)
export async function createUser(req, res) {
  const { username, password, email } = req.body;
  const result = await createCustomer({ username, password, email });
  
  res.json({
    user: result.user,
    password: result.password,
    message: "User created successfully. Save these credentials - the password cannot be retrieved later.",
  });
}

// HTTP handler for deleting a user (admin only)
export async function deleteUserById(req, res) {
  const { userId } = req.params;
  const result = await deleteUser(userId, req.user.id);
  
  res.json({
    message: "User and all associated data deleted successfully",
    deletedUser: result.deletedUser,
    deletedCallRecords: result.deletedCallRecords,
  });
}

// HTTP handler for linking calls to users by agent name (admin only)
export async function linkCalls(req, res) {
  const result = await linkCallsByAgent();
  res.json(result);
}

// HTTP handler for refreshing agent names and updating call associations (admin only)
export async function refreshAgents(req, res) {
  const result = await refreshAgentNames();
  res.json(result);
}
