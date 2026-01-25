import React from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TalkToSales from "./pages/TalkToSales";
import Voice from "./pages/Voice";
import SMS from "./pages/SMS";

export default function App() {
  const { token, user, login, logout } = useAuth();
  const history = useHistory();

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
