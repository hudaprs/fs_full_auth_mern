import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alertActions";
import {
  registerUser,
  removeIsSuccess,
  clearErrors
} from "../../actions/authActions";

const Register = ({
  setAlert,
  registerUser,
  removeIsSuccess,
  clearErrors,
  auth: { loading, errors, message, isSuccess, isAuthenticated },
  history
}) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  });

  const { name, email, password, passwordConfirmation } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === "" || email === "" || password === "") {
      setAlert("Please fill all forms", "danger");
    } else if (password !== passwordConfirmation) {
      setAlert("Password confirmation did not match", "danger");
    } else {
      registerUser({
        name,
        email,
        password,
        createdAt: new Date()
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) history.push("/");

    if (isSuccess) {
      setAlert(message, "success");
      setUser({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: ""
      });
      removeIsSuccess();
    }

    if (errors) {
      if (errors.message === "Email already registered") {
        setAlert(message, "danger");
        clearErrors();
      }
    }
    // eslint-disable-next-line
  }, [isSuccess, errors, setAlert, history, isAuthenticated]);

  return (
    <div className="form-container">
      <h1 className="text-primary">Register</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="name"
            name="name"
            id="name"
            value={name}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
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
          <label htmlFor="passwordConfirmation">Password Confirmation</label>
          <input
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            value={passwordConfirmation}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-block" disabled={loading}>
            {loading && <i className="fas fa-circle-notch fa-spin"></i>}{" "}
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired,
  removeIsSuccess: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  history: PropTypes.object,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  setAlert,
  registerUser,
  removeIsSuccess,
  clearErrors
})(Register);
