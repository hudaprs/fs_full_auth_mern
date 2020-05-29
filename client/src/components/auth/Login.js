import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert, removeAlert } from "../../actions/alertActions";
import { login, removeIsSuccess, clearErrors } from "../../actions/authActions";

const Login = ({
  setAlert,
  removeAlert,
  login,
  auth: { loading, isSuccess, message, errors, isAuthenticated },
  history,
  removeIsSuccess
}) => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const { email, password } = user;
  const { push } = history;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setAlert("Please fill all forms", "danger");
    } else {
      login(user);
    }
  };

  useEffect(() => {
    removeIsSuccess();
    if (isAuthenticated) push("/");

    if (isSuccess) {
      clearErrors();
      removeAlert();
    }

    if (errors) {
      if (
        errors.message === "Email not found" ||
        errors.message === "Your account is not active" ||
        errors.message === "Password invalid"
      ) {
        setAlert(message, "danger");
      }
    }
  }, [
    isSuccess,
    errors,
    isAuthenticated,
    message,
    push,
    removeAlert,
    setAlert,
    removeIsSuccess
  ]);

  return (
    <div className="form-container">
      <h1 className="text-primary">Login</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email.toLowerCase()}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-block">
            {loading && <i className="fas fa-circle-notch fa-spin"></i>} Login
          </button>
          <Link to="/forgot-password" className="btn btn-danger btn-block">
            Forgot Password
          </Link>
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
  removeAlert: PropTypes.func.isRequired,
  removeIsSuccess: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  setAlert,
  removeAlert,
  login,
  removeIsSuccess,
  clearErrors
})(Login);
