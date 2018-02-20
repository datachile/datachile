import React from "react";
import { translate } from "react-i18next";
import { Link } from "react-router";
import { connect } from "react-redux";
import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

import "./MapOptions.css";

class MapOptions extends React.Component {
  getDatasetsQueries() {
    const { datasets = [] } = this.props;
    return [...new Set(datasets.map(ds => ds.data.regiones.query))];
  }

  canSave() {
    const { mapData, datasets = [] } = this.props;
    if (mapData) {
      if (this.getDatasetsQueries().indexOf(mapData.regiones.query) == -1) {
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
        <Link className="option" to="/explore/map/data">
          {t("See data")}
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
            {t("Save data")}
          </a>
        )}
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
        indicator: indicator
      }
    });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    datasets: state.map.datasets,
    measure: state.map.params.measure.value,
    mapLevel: state.map.params.level,
    mapTitle: state.map.title,
    mapData: {
      regiones: {
        query: state.map.results.queries.region,
        data: state.map.results.data.region
      },
      comunas: state.map.results.queries.comuna
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
