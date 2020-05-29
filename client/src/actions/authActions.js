import {
  SET_LOADING,
  REGISTER_USER,
  AUTH_ERROR,
  REMOVE_ISSUCCESS,
  CLEAR_ERRORS,
  VERIFY_USER,
  LOAD_USER,
  LOGIN_USER,
  LOGOUT,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD
} from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

// Set loading
export const setLoading = () => {
  return {
    type: SET_LOADING
  };
};

// Set isSuccess to false
export const removeIsSuccess = () => {
  return {
    type: REMOVE_ISSUCCESS
  };
};

// Clear Errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

// Load authenticated user
export const loadUser = () => async (dispatch) => {
  setAuthToken(localStorage.token);
  dispatch(setLoading());

  try {
    const load = await axios.get("/auth");

    dispatch({ type: LOAD_USER, payload: load.data.results.user });
  } catch (err) {
    dispatch({ type: AUTH_ERROR, payload: err.response.data });
  }
};

// Logged in user
export const login = (userData) => async (dispatch) => {
  dispatch(setLoading());

  try {
    const logging = await axios.post("/auth/login", userData);

    dispatch({ type: LOGIN_USER, payload: logging.data });
    dispatch(loadUser());
  } catch (err) {
    dispatch({ type: AUTH_ERROR, payload: err.response.data });
  }
};

// Register user
export const registerUser = (userData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const register = await axios.post("/auth/register", userData);

    dispatch({ type: REGISTER_USER, payload: register.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR, payload: err.response.data });
  }
};

// Verify user
export const verifyUser = (token) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const verify = await axios.get(`/auth/verify?token=${token}`);

    dispatch({ type: VERIFY_USER, payload: verify.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR, payload: err.response.data });
  }
};

// Logout user
export const logout = () => {
  return {
    type: LOGOUT
  };
};

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const forgot = await axios.post("/auth/forgot-password", email);

    dispatch({ type: FORGOT_PASSWORD, payload: forgot.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR, payload: err.response.data });
  }
};

// Change password
export const changePassword = (passwordData, token) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const change = await axios.post(
      `/auth/change-password?token=${token}`,
      passwordData
    );

    dispatch({ type: CHANGE_PASSWORD, payload: change.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR, payload: err.response.data });
  }
};
