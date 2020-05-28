import { REMOVE_ALERT, SET_ALERT } from "./types";

export const removeAlert = () => {
  return {
    type: REMOVE_ALERT
  };
};

export const setAlert = (message, type) => (dispatch) => {
  dispatch({ type: SET_ALERT, payload: { message, type } });

  setTimeout(() => dispatch(removeAlert()), 5000);
};
