import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alertActions";
import { changePassword } from "../../actions/authActions";
import queryString from "query-string";

const ChangePassword = ({
  setAlert,
  auth: { loading, message, errors, isAuthenticated, isSuccess },
  history,
  location,
  changePassword
}) => {
  const { token, type } = queryString.parse(location.search);

  const [pass, setPass] = useState({
    password: "",
    passwordConfirmation: ""
  });

  const { password, passwordConfirmation } = pass;

  const onChange = (e) => setPass({ ...pass, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    if (password === "") {
      setAlert("Password is required", "danger");
    } else if (password !== passwordConfirmation) {
      setAlert("Password confirmation did not match", "danger");
    } else if (password.length < 6) {
      setAlert("Password length minimal is 6", "danger");
    } else {
      changePassword(
        {
          password,
          passwordConfirmation
        },
        token
      );
    }
  };

  useEffect(() => {
    if (isAuthenticated) history.push("/");

    if (isSuccess) {
      setAlert("Password has been changed", "success");
      setPass({
        password: "",
        passwordConfirmation: ""
      });
    }

    if (errors) {
      if (
        errors.message === "Token invalid" ||
        errors.message === "Password confirmation did not match"
      ) {
        setAlert(message, "danger");
      }
    }
  }, [isAuthenticated, history, isSuccess, setAlert, errors, message]);

  // Token not found
  if (!token) {
    return (
      <div style={{ textAlign: "center" }}>
        <i className="fas fa-times-circle fa-10x text-danger"></i>
        <h3 className="text-danger">Token / Type Not Found</h3>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1 className="text-primary">Forgot Password</h1>
      <form onSubmit={onSubmit}>
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
          <button type="submit" className="btn btn-block">
            {loading && <i className="fas fa-circle-notch fa-spin"></i>}
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

ChangePassword.propTypes = {
  auth: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  history: PropTypes.object,
  location: PropTypes.object
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  setAlert,
  changePassword
})(ChangePassword);
