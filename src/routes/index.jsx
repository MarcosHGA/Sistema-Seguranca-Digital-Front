import React from "react";
import { useAuth } from "../services/auth";
import { Route, Switch, Redirect } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import DashboardPage from "../pages/DashboardPage";
import SystemIncludePage from "../pages/SystemIncludePage";
import EditSystemPage from "../pages/EditSystemPage";

function Routes() {
  const [logged] = useAuth();
  return (
    <Switch>
      {!logged && (
        <>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/register">
            <RegisterPage />
          </Route>
          <Redirect to="/login" />
        </>
      )}
      {logged && (
        <>
          <Route exact path="/dashboard">
            <DashboardPage />
          </Route>
          <Route exact path="/dashboard/system-include">
            <SystemIncludePage />
          </Route>
          <Route exact path="/dashboard/edit/:id" component={EditSystemPage} />
          <Redirect to="/dashboard" />
        </>
      )}
    </Switch>
  );
}

export default Routes;
