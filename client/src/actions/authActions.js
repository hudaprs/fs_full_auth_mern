import {
  SET_LOADING,
  REGISTER_USER,
  AUTH_ERROR,
  REMOVE_ISSUCCESS,
  CLEAR_ERRORS,
  VERIFY_USER,
  LOAD_USER,
  LOGIN_USER,
  LOGOUT
} from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

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

export const logout = () => {
  return {
    type: LOGOUT
  };
};
