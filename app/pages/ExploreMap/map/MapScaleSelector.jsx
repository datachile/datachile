import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import "./mapScaleSelector.css";

class MapScaleSelector extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { setMapScale, queryLog } = nextProps;

    if (!queryLog) {
      setMapScale("linear");
    }
  }

  render() {
    const { t, mapScale, setMapScale, queryLinear, queryLog } = this.props;

    if (!queryLinear) {
      return null;
    }

    return (
      <div className="map-select-options">
        <p className="map-select-text">{t("Visualize by")}</p>
        <div className="map-select-options-container">
          <a
            className={`toggle ${mapScale === "linear" ? "selected" : ""}`}
            onClick={evt => setMapScale("linear")}
          >
            {t("Linear")}
          </a>
          <a
            className={`toggle ${mapScale === "log" ? "selected" : ""} ${
              !queryLog ? "disabled" : ""
            }`}
            onClick={evt => {
              if (queryLog) {
                setMapScale("log");
              }
            }}
          >
            {t("Log")}
          </a>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setMapScale(payload) {
    dispatch({ type: "MAP_SCALE_SET", payload });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    mapScale: state.map.params.scale,
    queryLinear: state.map.results.queries.region,
    queryLog: state.map.results.queries.comuna
  };
};

MapScaleSelector = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapScaleSelector)
);

export default MapScaleSelector;
export { MapScaleSelector };
