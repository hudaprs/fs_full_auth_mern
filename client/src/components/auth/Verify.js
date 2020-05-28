import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import queryString from "query-string";
import { verifyUser } from "../../actions/authActions";

const Verify = ({ location: { search }, auth, verifyUser, history }) => {
  const { token } = queryString.parse(search);
  const { loading, message, isSuccess, errors } = auth;

  useEffect(() => {
    if (!localStorage.token) {
      verifyUser(token);
    } else {
      history.push("/");
    }
    // eslint-disable-next-line
  }, [history]);

  return (
    <div>
      <h1
        className="text-primary"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        Verification Account
      </h1>

      <hr />

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {/* Loading */}
        {loading && (
          <Fragment>
            <i className="fas fa-circle-notch fa-10x fa-spin text-primary "></i>
            <h3 className="text-primary">
              Verificating your account, please wait
            </h3>
          </Fragment>
        )}

        <div className="verification-animation">
          {/* Verificated */}
          {!loading && isSuccess && (
            <Fragment>
              <i className="fas fa-check-circle fa-10x text-primary"></i>
              <h3 className="text-primary">{message}</h3>
            </Fragment>
          )}

          {/* Failed */}
          {!loading && errors && (
            <Fragment>
              <i className="fas fa-times-circle fa-10x text-danger"></i>
              <h3 className="text-danger">{message}</h3>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

Verify.propTypes = {
  location: PropTypes.object,
  auth: PropTypes.object.isRequired,
  verifyUser: PropTypes.func.isRequired,
  history: PropTypes.object
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  verifyUser
})(Verify);
