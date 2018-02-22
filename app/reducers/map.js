import { combineReducers } from "redux";

const mapParamsInitialState = {
  indicator: { value: "" },
  level: "region",
  measure: { value: "" },
  topic: { value: "economy" },
  cuts: {},
  year: 2015
};

const mapParamsReducer = (state = mapParamsInitialState, action) => {
  switch (action.type) {
    case "MAP_CUT_SET":
      return {
        ...state,
        cuts: { ...state.cuts, [action.payload.level]: action.payload.value }
      };

    case "MAP_INDICATOR_SET":
      return { ...state, indicator: action.payload, cuts: {} };

    case "MAP_LEVEL_SET":
      return { ...state, level: action.payload };

    case "MAP_MEASURE_SET":
      return { ...state, measure: action.payload };

    case "MAP_TOPIC_SET":
      return {
        ...state,
        topic: action.payload,
        indicator: { value: "" },
        cuts: {}
      };

    case "MAP_YEAR_SET":
      return { ...state, year: action.payload };

    case "MAP_YEAR_OPTIONS":
      // payload is an array of year strings
      return { ...state, year: [].concat(action.payload).pop() };

    default:
      return state;
  }
};

const mapOptionsInitialState = {
  status: "SUCCESS",
  lastError: null,
  year: [2015],
  cubes: []
};

const mapOptionsReducer = (state = mapOptionsInitialState, action) => {
  switch (action.type) {
    case "MAP_MEMBER_FETCH":
      return { ...state, status: "LOADING", lastError: null };

    case "MAP_MEMBER_SUCCESS":
      const newState = {
        ...state,
        status: "SUCCESS",
        lastError: null,
        cubes: [].concat(state.cubes, action.payload.cube)
      };
      const levels = action.payload.levels;
      for (let level, i = 0; (level = levels[i]); i++) {
        newState[level.name] = level.members;
      }
      return newState;

    case "MAP_MEMBER_ERROR":
      return {
        ...state,
        status: "ERROR",
        lastError: action.payload
      };

    case "MAP_YEAR_OPTIONS":
      return { ...state, year: [].concat(action.payload) };

    default:
      return state;
  }
};

const mapDatasetReducer = (state = [], action) => {
  switch (action.type) {
    case "MAP_SAVE_DATASET":
      return [].concat(state, action.payload);

    case "MAP_DELETE_DATASET":
      return state.filter((item, index) => index !== action.index);

    default:
      return state;
  }
};

const mapResultInitialState = {
  status: "SUCCESS",
  lastError: null,
  data: { region: undefined, comuna: undefined },
  queries: { region: false, comuna: false }
};

const mapResultReducer = (state = mapResultInitialState, action) => {
  switch (action.type) {
    case "MAP_DATA_FETCH":
      return { ...state, status: "LOADING", lastError: null };

    case "MAP_DATA_SUCCESS":
      // this way I make sure the state keeps the shape
      return {
        status: "SUCCESS",
        lastError: null,
        queries: {
          region: action.payload.queryRegion || false,
          comuna: action.payload.queryComuna || false
        },
        data: {
          region: action.payload.dataRegion || undefined,
          comuna: action.payload.dataComuna || undefined
        }
      };

    case "MAP_DATA_ERROR":
      return {
        ...state,
        status: "ERROR",
        lastError: action.payload
      };

    default:
      return state;
  }
};

const mapTitleReducer = (state = "", action) => {
  switch (action.type) {
    case "MAP_SET_TITLE":
      return action.payload;

    default:
      return state;
  }
};

export default combineReducers({
  datasets: mapDatasetReducer,
  options: mapOptionsReducer,
  params: mapParamsReducer,
  results: mapResultReducer,
  title: mapTitleReducer
});
