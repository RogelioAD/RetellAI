import { useState } from "react";

// Manages authentication state and provides login/logout functions using localStorage
export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  });

  // Stores token and user in localStorage and updates state
  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  // Removes token and user from localStorage and clears state
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return {
    token,
    user,
    isAdmin,
    login,
    logout
  };
}
