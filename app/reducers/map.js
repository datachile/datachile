import { combineReducers } from "redux";

const mapParamsInitialState = {
  topic: { value: "economy" },
  indicator: null
};

const mapParamsReducer = (state = mapParamsInitialState, action) => {
  switch (action.type) {
    case "MAP_TOPIC_SET":
      return { ...state, topic: action.payload, indicator: null };

    case "MAP_INDICATOR_SET":
      return { ...state, indicator: action.payload };

    default:
      return state;
  }
};

const mapLevelReducer = (state = { ...state, value: "regiones" }, action) => {
  switch (action.type) {
    case "MAP_LEVEL_SET":
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

const mapYearReducer = (state = { ...state, value: false }, action) => {
  switch (action.type) {
    case "MAP_YEAR_SET":
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

const mapDatasetReducer = (state = { ...state, list: [] }, action) => {
  console.log(state.list);
  switch (action.type) {
    case "MAP_SAVE_DATASET":
      return {
        ...state,
        list: [...state.list, action.dataset]
      };
    case "MAP_DELETE_DATASET":
      return {
        ...state,
        list: state.list.filter((item, index) => index !== action.index)
      };
    default:
      return state;
  }
};

const mapResultReducer = (
  state = { ...state, queries: { regiones: false, comunas: false } },
  action
) => {
  switch (action.type) {
    case "MAP_NEW_RESULTS":
      return {
        ...state,
        queries: action.results
      };
    default:
      return state;
  }
};

export default combineReducers({
  params: mapParamsReducer,
  level: mapLevelReducer,
  year: mapYearReducer,
  datasets: mapDatasetReducer,
  results: mapResultReducer
});
