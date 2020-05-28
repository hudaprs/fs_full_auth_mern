import {
  REGISTER_USER,
  AUTH_ERROR,
  SET_LOADING,
  REMOVE_ISSUCCESS,
  CLEAR_ERRORS
} from "../actions/types";

const initialState = {
  user: null,
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
    case AUTH_ERROR:
      return {
        ...state,
        loading: false,
        isSuccess: false,
        errors: payload,
        message: payload.message
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
