import {
  SET_LOADING,
  REGISTER_USER,
  AUTH_ERROR,
  REMOVE_ISSUCCESS,
  CLEAR_ERRORS
} from "./types";
import axios from "axios";

export const setLoading = () => {
  return {
    type: SET_LOADING
  };
};

export const removeIsSuccess = () => {
  return {
    type: REMOVE_ISSUCCESS
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const registerUser = (userData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const register = await axios.post("/auth/register", userData);

    dispatch({ type: REGISTER_USER, payload: register.data });
  } catch (err) {
    console.error(err.message);
    dispatch({ type: AUTH_ERROR, payload: err.response.data });
  }
};
