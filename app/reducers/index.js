import { combineReducers } from "redux";

const searchActive = (state = false, action) => {
  switch (action.type) {
    case "ACTIVATE_SEARCH":
      return !state;
    default:
      return state;
  }
};

const mapLevelReducer = (state = false, action) => {
  switch (action.type) {
    case "SETPARAM_MAPLEVEL":
      return { ...state, value: action.payload };
    default:
      return state.value ? state : { ...state, value: "regiones" };
  }
};

const mapTopicReducer = (state = false, action) => {
  switch (action.type) {
    case "SETPARAM_TOPICS":
      return { ...state, value: action.payload.key };
    default:
      return state.value ? state : { ...state, value: "economy" };
  }
};

const id = (state = {}) => state;

export default {
  focus: id,
  population_year: id,
  income_year: id,
  psu_year: id,
  presidential_election_year: id,
  senators_election_year: id,
  mayor_election_year: id,
  exports_year: id,
  imports_year: id,
  tax_data_year: id,
  nene_year: id,
  nene_month: id,
  sources: id,
  map: combineReducers({ level: mapLevelReducer, topic: mapTopicReducer }),
  search: combineReducers({ searchActive })
};
