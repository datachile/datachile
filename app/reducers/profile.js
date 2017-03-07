import {combineReducers} from "redux";

const stats = (state = [], action) => {
  switch (action.type) {
    case "GET_STATS_SUCCESS":
      return action.res;
    default:
      return state;
  }
};

const data = (state = {}, action) => {
  switch (action.type) {
    case "GET_DATA_SUCCESS":
      return Object.assign({}, state, {[action.res.key]: action.res.data});
    default:
      return state;
  }
};

const profileReducer = combineReducers({
  data, stats
});

export default profileReducer;
