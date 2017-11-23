import { combineReducers } from "redux";

const searchActive = (state = false, action) => {
	switch (action.type) {
		case "ACTIVATE_SEARCH":
			return !state;
		default:
			return state;
	}
};

function loadingProgress(state = { requests: 0, fulfilled: 0 }, action) {
  switch (action.type) {
  case "GET_DATA_REQUEST":
    return {
      ...state,
      requests: state.requests + 1
    };
  case "GET_DATA_SUCCESS":
    return {
      ...state,
      fulfilled: state.fulfilled + 1
    };
  case "LOADING_START":
  case "LOADING_END":
    return {
      requests: 0,
      fulfilled: 0
    };
  }
  return state;
}

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
	sources: id,
  loadingProgress: loadingProgress,
	search: combineReducers({ searchActive })
};
