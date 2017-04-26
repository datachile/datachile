import {combineReducers} from "redux";

const searchActive = (state = false, action) => {
  switch (action.type) {
    case "ACTIVATE_SEARCH":
      return !state;
    default:
      return state;
  }
};

export default {
  focus: (state = {}) => state,
  search: combineReducers({searchActive})
};
