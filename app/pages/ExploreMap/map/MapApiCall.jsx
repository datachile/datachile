import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Select from "components/Select";

import "./MapApiCall.css";

class MapApiCall extends React.Component {
  render() {
    const { t, results, mapLevel } = this.props;

    if (!results[mapLevel]) {
      return null;
    }

    const data = results[mapLevel];

    return (
      <div className="map-api-call">
        <div className="label-container">
          <label>{t("API call")}</label>
        </div>
        <div className="input-container">
          <input value={data} disabled />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    results: state.map.results.queries,
    mapLevel: state.map.params.level
  };
};

MapApiCall = translate()(connect(mapStateToProps)(MapApiCall));

export default MapApiCall;
export { MapApiCall };
