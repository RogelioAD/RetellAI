import { authenticateUser, changePassword } from "../services/authService.js";

// HTTP handler for user login - validates credentials and returns JWT token
export async function login(req, res) {
  const { username, password } = req.body;
  const result = await authenticateUser(username, password);
  res.json(result);
}

// HTTP handler for changing user password
export async function changeUserPassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  await changePassword(req.user.id, currentPassword, newPassword);
  res.json({ message: "Password changed successfully" });
}
