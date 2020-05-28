import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadUser, logout } from "../../actions/authActions";

const Navbar = ({ loadUser, logout, isAuthenticated, user, loading }) => {
  const onLogout = () => {
    logout();
  };

  // Load user automatically
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const AuthenticatedLinks = (
    <Fragment>
      <li>
        <a href="#!">Hello {user && user.name}</a>
      </li>
      <li>
        <a href="#!" onClick={onLogout}>
          <em className="fas fa-sign-out"></em> Logout
        </a>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </Fragment>
  );

  return (
    <header>
      <div className="navbar">
        <h1>Full Auth</h1>

        <nav>
          <ul>
            {!loading && isAuthenticated ? AuthenticatedLinks : guestLinks}
          </ul>
        </nav>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  loadUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object,
  loading: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loading: state.auth.loading
});

export default connect(mapStateToProps, { loadUser, logout })(Navbar);
