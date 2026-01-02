import React from "react";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

/**
 * Main App component
 */
export default function App() {
  const { token, user, login, logout } = useAuth();

  if (!token) {
    return <Login onLogin={login} />;
  }

  return <Dashboard token={token} user={user} onLogout={logout} />;
}
