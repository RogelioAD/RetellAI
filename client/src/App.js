import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

/**
 * Main application component that handles routing between Home, Login, and Dashboard.
 */
export default function App() {
  const { token, user, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  // Show home page first if not logged in and login not requested
  if (!token && !showLogin) {
    return <Home onNavigateToLogin={() => setShowLogin(true)} />;
  }

  // Show login page when user clicks "View Transcripts"
  if (!token && showLogin) {
    return <Login onLogin={login} onNavigateToHome={() => setShowLogin(false)} />;
  }

  return <Dashboard token={token} user={user} onLogout={logout} />;
}
