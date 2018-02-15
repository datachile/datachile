import { combineReducers } from "redux";
import mapReducers from "./map.js";

const searchActive = (state = false, action) => {
  switch (action.type) {
    case "ACTIVATE_SEARCH":
      return !state;
    default:
      return state;
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
  map: mapReducers,
  search: combineReducers({ searchActive })
};
