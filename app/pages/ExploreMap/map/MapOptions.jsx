import React from "react";
import { translate } from "react-i18next";
import { Link } from "react-router";
import { connect } from "react-redux";

import MapTitle from "./MapTitle";

import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

import "./MapOptions.css";

class MapOptions extends React.Component {
  getDatasetsQueries() {
    const { datasets = [] } = this.props;
    return [...new Set(datasets.map(ds => ds.indicator))];
  }

  canSave() {
    const { measure, datasets = [] } = this.props;
    if (measure) {
      if (this.getDatasetsQueries().indexOf(measure.value) == -1) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { datasets = [], mapLevel, measure, mapData, mapTitle } = this.props;
    const { t, saveDataset } = this.props;

    const canSave = this.canSave();

    return (
      <div className="map-options">
        <MapTitle />
        <div className="map-options-container">
          <Link className="option" to="/explore/map/data">
            {t("Cart")}
            {datasets.length > 0 && <span> ({datasets.length})</span>}
          </Link>
          {mapData && (
            <a
              className={`${canSave ? "option" : "option disabled"}`}
              onClick={
                canSave
                  ? evt => saveDataset(mapTitle, mapData, mapLevel, measure)
                  : null
              }
            >
              {t("Add to cart")}
            </a>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  // we have to discuss this structure
  saveDataset(title, dataset, level, indicator) {
    dispatch({
      type: "MAP_SAVE_DATASET",
      payload: {
        title: title,
        data: dataset,
        level: level,
        indicator: indicator.value
      }
    });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    datasets: state.map.datasets,
    measure: state.map.params.measure,
    mapLevel: state.map.params.level,
    mapTitle: state.map.title,
    mapData: {
      region: {
        query: state.map.results.queries.region,
        data: state.map.results.data.region
      },
      comuna: state.map.results.queries.comuna
        ? {
            query: state.map.results.queries.comuna,
            data: state.map.results.data.comuna
          }
        : false
    }
  };
};

MapOptions = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapOptions)
);

export default MapOptions;
export { MapOptions };
