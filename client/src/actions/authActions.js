import {
  SET_LOADING,
  REGISTER_USER,
  AUTH_ERROR,
  REMOVE_ISSUCCESS,
  CLEAR_ERRORS,
  VERIFY_USER
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
    dispatch({ type: AUTH_ERROR, payload: err.response.data });
  }
};

export const verifyUser = (token) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const verify = await axios.get(`/auth/verify?token=${token}`);

    dispatch({ type: VERIFY_USER, payload: verify.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR, payload: err.response.data });
  }
};
