import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import "./MapLevelSelector.css";

class MapLevelSelector extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps && !nextProps.queryComuna) {
      nextProps.setMapLevel("region");
    } 
    else if(!this.props.queryComuna && nextProps.queryComuna) {
      nextProps.setMapLevel("comuna");
    }
  }

  setLevelRegion = () => {
    this.props.setMapLevel("region");
  };

  setLevelComuna = () => {
    this.props.queryComuna && this.props.setMapLevel("comuna");
  };

  render() {
    const { t, mapLevel } = this.props;

    if (!this.props.queryRegion) {
      return null;
    }

    return (
      <div className="map-switch-options">
        <p className="map-switch-text">{t("Visualize by")}</p>
        <div className="map-switch-options-container">
          <a
            className={`toggle ${mapLevel === "region" ? "selected" : ""}`}
            onClick={this.setLevelRegion}
          >
            {t("Regiones")}
          </a>
          <a
            className={`toggle ${mapLevel === "comuna" ? "selected" : ""} ${
              !this.props.queryComuna ? "disabled" : ""
            }`}
            onClick={this.setLevelComuna}
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

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapLevelSelector)
);
