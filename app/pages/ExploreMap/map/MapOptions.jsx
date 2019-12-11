import React from "react";
import {withNamespaces} from "react-i18next";
import {connect} from "react-redux";
import {Link} from "react-router";
import "./MapOptions.css";
import MapTitle from "./MapTitle";

class MapOptions extends React.Component {
  getDatasetsQueries() {
    const {datasets = []} = this.props;
    return [...new Set(datasets.map(ds => ds.data.region.query))];
  }

  canSave() {
    const {mapData} = this.props;
    if (mapData) {
      if (this.getDatasetsQueries().indexOf(mapData.region.query) == -1) {
        return true;
      }
    }
    return false;
  }

  render() {
    const {datasets = [], mapLevel, measure, mapData, mapTitle, topic} = this.props;
    const {t, saveDataset} = this.props;

    const canSave = this.canSave();

    return (
      <div className="map-options">
        <MapTitle />
        <div className="map-options-container">
          <Link className="option" to="/explore/map/data">
            <img src="/images/icons/icon-see-data.svg" />
            <span className="text">
              {t("Cart")}
              {datasets.length > 0 && <span> ({datasets.length})</span>}
            </span>
          </Link>
          {mapData && (
            <a
              className={`${canSave ? "option" : "option disabled"}`}
              onClick={
                canSave ? (
                  evt => saveDataset(mapTitle, mapData, mapLevel, measure, topic)
                ) : null
              }
            >
              <img src="/images/icons/icon-save-data.svg" />
              <span className="text">
                {canSave ? t("Add to cart") : t("Added to cart")}
              </span>
            </a>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  saveDataset(title, dataset, level, indicator, topic) {
    dispatch({
      type: "MAP_SAVE_DATASET",
      payload: {
        title: title,
        data: dataset,
        level: level,
        indicator: indicator.value,
        topic: topic.value,
        cube: indicator.cube
      }
    });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    datasets: state.map.datasets,
    measure: state.map.params.measure,
    topic: state.map.params.topic,
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

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(MapOptions));
