import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Alert from "./components/alert/Alert";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Verify from "./components/auth/Verify";
import ForgotPassword from "./components/auth/ForgotPassword";
import ChangePassword from "./components/auth/ChangePassword";
import PrivateRoute from "./components/routes/PrivateRoute";
import "./App.css";

import { Provider } from "react-redux";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <div className="container">
            <Alert />
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/verify" component={Verify} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route exact path="/change-password" component={ChangePassword} />
              <Route exact component={NotFound} />
            </Switch>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
