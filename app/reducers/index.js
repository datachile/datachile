import { combineReducers } from "redux";

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
	population_year: (state = {}) => state,
	income_year: (state = {}) => state,
	psu_year: (state = {}) => state,
	presidential_election_year: (state = {}) => state,
	senators_election_year: (state = {}) => state,
	mayor_election_year: (state = {}) => state,
	exports_year: (state = {}) => state,
	imports_year: (state = {}) => state,
	tax_data_year: (state = {}) => state,
	nene_year: (state = {}) => state,
	sources: (state = {}) => state,
	search: combineReducers({ searchActive })
};
