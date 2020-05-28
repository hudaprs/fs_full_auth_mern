import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Alert = ({ alert }) => {
  return (
    alert !== null && (
      <div className={`alert alert-${alert.type}`}>
        <em className="fas fa-info-circle"></em> {alert.message}
      </div>
    )
  );
};

Alert.propTypes = {
  alert: PropTypes.object
};

const mapStateToProps = (state) => ({
  alert: state.alert
});

export default connect(mapStateToProps)(Alert);
