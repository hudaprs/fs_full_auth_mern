import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import {
  verifyUser,
  removeIsSuccess,
  clearErrors
} from "../../actions/authActions";

const Verify = ({
  location: { search },
  auth,
  verifyUser,
  removeIsSuccess,
  clearErrors
}) => {
  const { token } = queryString.parse(search);
  const { loading, message, isSuccess, errors } = auth;

  useEffect(() => {
    verifyUser(token);
    // eslint-disable-next-line
  }, []);

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

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  verifyUser,
  removeIsSuccess,
  clearErrors
})(Verify);
