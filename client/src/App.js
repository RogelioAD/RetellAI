import React, { useEffect } from "react";
import { Switch, Route, Redirect, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TalkToSales from "./pages/TalkToSales";
import Voice from "./pages/Voice";
import SMS from "./pages/SMS";
import PricingPage from "./pages/Pricing";

export default function App() {
  const { token, user, login, logout } = useAuth();
  const history = useHistory();
  const location = useLocation();

  // Scroll to top when route or tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogin = (res) => {
    login(res);
    history.push("/dashboard");
  };

  return (
    <Switch>
      <Route path="/login">
        {token ? <Redirect to="/dashboard" /> : <Login onLogin={handleLogin} />}
      </Route>
      <Route path="/talk-to-sales">
        {token ? <Redirect to="/dashboard" /> : <TalkToSales />}
      </Route>
      <Route path="/solutions/voice">
        <Voice />
      </Route>
      <Route path="/solutions/sms">
        <SMS />
      </Route>
      <Route path="/pricing">
        <PricingPage />
      </Route>
      <Route path="/dashboard">
        {!token ? <Redirect to="/login" /> : <Dashboard token={token} user={user} onLogout={logout} />}
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
}
