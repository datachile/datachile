import React from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import { translate } from "react-i18next";

import DatachileLoading from "components/DatachileLoading";
import Nav from "components/Nav";

import MapSidebar from "./map/MapSidebar";
import MapContent from "./map/MapContent";
import MapLevelSelector from "./map/MapLevelSelector";
import MapTitle from "./map/MapTitle";
import MapOptions from "./map/MapOptions";
import MapYearSelector from "./map/MapYearSelector";

import DataSidebar from "./data/DataSidebar";
import DataContent from "./data/DataContent";

import requestData from "./actions.js";

import { NonIdealState } from "@blueprintjs/core";
import DatachileProgressBar from "components/DatachileProgressBar";

import "./explore-map.css";

class ExploreMap extends React.Component {
  state = {};

  static need = [MapSidebar];

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    const { mapYear, mapIndicator, queryRegion, queryComuna } = nextProps;

    if (mapIndicator && this.props.mapIndicator != mapIndicator) {
      dispatch(
        requestData({
          cubeName: mapIndicator,
          cuts: [],
          locale: nextProps.i18n.language
        })
      );
    }
  }

  render() {
    const { section } = this.props.routeParams;
    const { data, t, status } = this.props;

    return (
      <CanonComponent
        id="explore-map"
        data={data}
        topics={[]}
        loadingComponent={<DatachileLoading />}
      >
        <div className="explore-map-page">
          <Nav title="" typeTitle="" type={false} dark={true} />

          <div className="explore-map-container">
            {!section && (
              <div className="explore-map-section">
                <div className="explore-map-sidebar">
                  <MapSidebar data={data} />
                </div>
                <div className="explore-map-content">
                  <NonIdealState
                    className={`explore-map-loading ${
                      status == "LOADING" ? "loading" : ""
                    }`}
                    title={t("loading.map")}
                    description={t("loading.developed")}
                    visual={<DatachileProgressBar value={1} />}
                  />
                  <MapTitle />
                  <MapLevelSelector />
                  <MapYearSelector />
                  <MapOptions />
                  <MapContent />
                </div>
              </div>
            )}
            {section &&
              section == "data" && (
                <div className="explore-map-section">
                  <div className="explore-map-sidebar">
                    <DataSidebar />
                  </div>
                  <div className="explore-map-content">
                    <DataContent />
                  </div>
                </div>
              )}
          </div>
        </div>
      </CanonComponent>
    );
  }
}

const mapStateToProps = state => {
  const params = state.map.params;
  return {
    data: state.data,
    results: state.map.results,

    mapYear: params.year,
    mapTopic: params.topic && params.topic.value,
    mapIndicator: params.indicator && params.indicator.value,

    queryRegion: state.map.results.queries.region,
    queryComuna: state.map.results.queries.comuna,

    status: state.map.results.status
  };
};

export default translate()(connect(mapStateToProps)(ExploreMap));
