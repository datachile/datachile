import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import "./MapLevelSelector.css";

class MapLevelSelector extends Component {
  static need = [];

  constructor(props) {
    super(props);
  }

  render() {
    const { t, mapLevel, setMapLevel } = this.props;
    return (
      <div className="map-switch-options">
        <a
          className={`toggle ${mapLevel === "regiones" ? "selected" : ""}`}
          onClick={evt => setMapLevel("regiones")}
        >
          {t("Regiones")}
        </a>
        <a
          className={`toggle ${mapLevel === "comunas" ? "selected" : ""}`}
          onClick={evt => setMapLevel("comunas")}
        >
          {t("Comunas")}
        </a>
      </div>
    );
  }

  toggleChart(level) {}
}

const mapDispatchToProps = dispatch => ({
  setMapLevel(value) {
    dispatch({ type: "SETPARAM_MAPLEVEL", payload: value });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    mapLevel: state.map.level.value
  };
};

MapLevelSelector = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapLevelSelector)
);

export default MapLevelSelector;
export { MapLevelSelector };
