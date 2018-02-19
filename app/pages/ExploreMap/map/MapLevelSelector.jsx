import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import "./MapLevelSelector.css";

class MapLevelSelector extends Component {
  static need = [];

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const { setMapLevel, results } = nextProps;
    if (!results.queries.comunas) {
      setMapLevel("regiones");
    }
  }

  render() {
    const { t, mapLevel, setMapLevel, results } = this.props;

    if (!results || !results.queries || !results.queries.regiones) {
      return null;
    }

    return (
      <div className="map-switch-options">
        <a
          className={`toggle ${mapLevel === "regiones" ? "selected" : ""}`}
          onClick={evt => setMapLevel("regiones")}
        >
          {t("Regiones")}
        </a>
        {results.queries.comunas && (
          <a
            className={`toggle ${mapLevel === "comunas" ? "selected" : ""}`}
            onClick={evt => setMapLevel("comunas")}
          >
            {t("Comunas")}
          </a>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setMapLevel(value) {
    dispatch({ type: "MAP_LEVEL_SET", payload: value });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    mapLevel: state.map.level.value,
    results: state.map.results
  };
};

MapLevelSelector = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapLevelSelector)
);

export default MapLevelSelector;
export { MapLevelSelector };
