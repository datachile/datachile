import React from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import { translate } from "react-i18next";
import isEqual from "lodash/isEqual";

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

import { requestData, requestMembers } from "./actions.js";

import { NonIdealState } from "@blueprintjs/core";
import DatachileProgressBar from "components/DatachileProgressBar";

import "./explore-map.css";

class ExploreMap extends React.Component {
  state = {};

  static need = [MapSidebar];

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    const { loadedMembers, mapCuts, mapIndicator } = nextProps;

    const mapIndicatorChanged =
      mapIndicator && this.props.mapIndicator != mapIndicator;
    const mapCutsChanged = !isEqual(this.props.mapCuts, mapCuts);

    if (mapIndicatorChanged || mapCutsChanged) {
      dispatch(
        requestData({
          cubeName: mapIndicator,
          cuts: Object.keys(mapCuts).reduce((output, levelFullName) => {
            const cuts = mapCuts[levelFullName].map(
              cut => `${levelFullName}.&[${cut.key}]`
            );
            return output.concat(cuts);
          }, []),
          locale: nextProps.i18n.language
        })
      );
    }
    if (mapIndicatorChanged && !loadedMembers.includes(mapIndicator))
      dispatch(requestMembers(mapIndicator));
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

    loadedMembers: state.map.options.cubes,

    mapCuts: params.cuts,
    mapIndicator: params.indicator && params.indicator.value,
    mapTopic: params.topic && params.topic.value,
    mapYear: params.year,

    status: state.map.results.status
  };
};

export default translate()(connect(mapStateToProps)(ExploreMap));
