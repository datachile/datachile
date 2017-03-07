import {combineReducers} from "redux";
import {routerReducer as routing} from "react-router-redux";
import {titleCase} from "d3plus-text";
import {dataFold} from "d3plus-viz";

import {default as profile} from "./profile";

const searchActive = (state = false, action) => {
  switch (action.type) {
    case "ACTIVATE_SEARCH":
      return !state;
    default:
      return state;
  }
};

export default combineReducers({
  attrs: (state = {}) => {
    const lookup = {};
    for (const key in state) {
      if ({}.hasOwnProperty.call(state, key)) {
        if (state[key].data && state[key].headers) {
          lookup[key] = dataFold(state[key]).reduce((obj, d) => (d.name = titleCase(d.name), obj[d.id] = d, obj), {});
        }
        else lookup[key] = state[key];
      }
    }
    return lookup;
  },
  focus: (state = {}) => state,
  profile,
  routing,
  search: combineReducers({searchActive})
});
