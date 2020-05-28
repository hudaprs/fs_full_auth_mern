import { REMOVE_ALERT, SET_ALERT } from "../actions/types";

const initialState = null;

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case REMOVE_ALERT:
      return null;
    case SET_ALERT:
      return payload;
    default:
      return state;
  }
};
