import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import "./MapLevelSelector.css";

class MapLevelSelector extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { setMapLevel, queryComuna } = nextProps;

    if (!queryComuna) {
      setMapLevel("region");
    }
  }

  render() {
    const { t, mapLevel, setMapLevel, queryRegion, queryComuna } = this.props;

    if (!queryRegion) {
      return null;
    }

    return (
      <div className="map-switch-options">
        <p className="map-switch-text">{t("Visualize by")}</p>
        <div className="map-switch-options-container">
          <a
            className={`toggle ${mapLevel === "region" ? "selected" : ""}`}
            onClick={evt => setMapLevel("region")}
          >
            {t("Regiones")}
          </a>
          <a
            className={`toggle ${mapLevel === "comuna" ? "selected" : ""} ${
              !queryComuna ? "disabled" : ""
            }`}
            onClick={evt => {
              if (queryComuna) {
                setMapLevel("comuna");
              }
            }}
          >
            {t("Comunas")}
          </a>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setMapLevel(payload) {
    dispatch({ type: "MAP_LEVEL_SET", payload });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    mapLevel: state.map.params.level,
    queryRegion: state.map.results.queries.region,
    queryComuna: state.map.results.queries.comuna
  };
};

MapLevelSelector = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapLevelSelector)
);

export default MapLevelSelector;
export { MapLevelSelector };
