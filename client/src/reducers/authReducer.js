import {
  REGISTER_USER,
  AUTH_ERROR,
  SET_LOADING,
  REMOVE_ISSUCCESS,
  CLEAR_ERRORS,
  VERIFY_USER,
  LOAD_USER,
  LOGIN_USER,
  LOGOUT,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  user: null,
  isAuthenticated: false,
  loading: false,
  isSuccess: false,
  errors: null,
  message: ""
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case REGISTER_USER:
      return {
        ...state,
        loading: false,
        isSuccess: true,
        errors: null,
        message: payload.message
      };
    case VERIFY_USER:
      return {
        ...state,
        loading: false,
        isSuccess: true,
        errors: null,
        message: payload.message
      };
    case LOGIN_USER:
      localStorage.setItem("token", payload.results.token);
      return {
        ...state,
        token: localStorage.getItem("token"),
        isAuthenticated: true,
        loading: false,
        isSuccess: true,
        errors: null,
        message: payload.message
      };
    case LOAD_USER:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: payload,
        errors: null,
        message: payload.message
      };
    case AUTH_ERROR:
      localStorage.clear();
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        isSuccess: false,
        errors: payload,
        message: payload.message
      };
    case LOGOUT:
      localStorage.clear();
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false,
        errors: null,
        message: ""
      };
    case FORGOT_PASSWORD:
      return {
        ...state,
        message: payload.message,
        loading: false,
        isSuccess: true
      };
    case CHANGE_PASSWORD:
      return {
        ...state,
        message: payload.message,
        loading: false,
        isSuccess: true
      };
    case REMOVE_ISSUCCESS:
      return {
        ...state,
        isSuccess: false
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        errors: null
      };
    default:
      return state;
  }
};
