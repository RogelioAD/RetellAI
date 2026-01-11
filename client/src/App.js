import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Main application component - handles routing between Home, Login, and Dashboard based on authentication state
export default function App() {
  const { token, user, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (!token && !showLogin) {
    return <Home onNavigateToLogin={() => setShowLogin(true)} />;
  }

  if (!token && showLogin) {
    return <Login onLogin={login} onNavigateToHome={() => setShowLogin(false)} />;
  }

  return <Dashboard token={token} user={user} onLogout={logout} />;
}
