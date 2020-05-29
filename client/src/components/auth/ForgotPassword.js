import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alertActions";
import {
  removeIsSuccess,
  clearErrors,
  forgotPassword
} from "../../actions/authActions";

const ForgotPassword = ({
  auth: { loading, errors, isSuccess, message, isAuthenticated },
  setAlert,
  removeIsSuccess,
  clearErrors,
  forgotPassword,
  history
}) => {
  const [email, setEmail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    if (email === "") {
      setAlert("Email is required", "danger");
    } else {
      forgotPassword({
        email
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) history.push("/");

    if (isSuccess) {
      setAlert(message, "success");
      setEmail("");
    }

    if (errors) {
      if (errors.message === "Email not found") {
        setAlert(message, "danger");
        clearErrors();
      }
    }
  }, [
    errors,
    isSuccess,
    message,
    clearErrors,
    setAlert,
    isAuthenticated,
    history
  ]);

  return (
    <div className="form-container">
      <h1 className="text-primary">Forgot Password</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email.toLowerCase()}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-block">
            {loading && <i className="fas fa-circle-notch fa-spin"></i>} Send
            Verification Link
          </button>
          <Link to="/login" className="btn btn-success btn-block">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

ForgotPassword.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  setAlert,
  removeIsSuccess,
  clearErrors,
  forgotPassword
})(ForgotPassword);
