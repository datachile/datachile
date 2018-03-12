import React from "react";
import { connect } from "react-redux";
import { CanonProfile, Canon } from "datawheel-canon";

import { translate } from "react-i18next";
import isEqual from "lodash/isEqual";

import Nav from "components/Nav";

import MapSidebar from "./MapSidebar";
import MapContent from "./MapContent";
import MapLevelSelector from "./MapLevelSelector";
import MapScaleSelector from "./MapScaleSelector";
import MapOptions from "./MapOptions";

import { requestData, requestMembers } from "../actions.js";

import { SyncStateAndLocalStorage } from "helpers/localStorage";

import { NonIdealState } from "@blueprintjs/core";
import DatachileProgressBar from "components/DatachileProgressBar";

import "../explore-map.css";

class ExploreMap extends React.Component {
  state = {};

  static need = [MapSidebar];

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    const { loadedMembers, mapCube, mapCuts } = nextProps;
    const locale = nextProps.i18n.language;

    const mapCubeChanged = mapCube && this.props.mapCube != mapCube;
    const mapCutsChanged = !isEqual(this.props.mapCuts, mapCuts);

    if (mapCubeChanged || mapCutsChanged) {
      dispatch(
        requestData({
          cubeName: mapCube,
          cuts: Object.keys(mapCuts).reduce((output, key) => {
            const cuts = mapCuts[key].map(cut => cut.fullName);
            return output.concat(cuts);
          }, []),
          locale: locale
        })
      );
    }
    if (mapCubeChanged && !loadedMembers.includes(mapCube))
      dispatch(requestMembers(mapCube, locale));
  }

  render() {
    const { section } = this.props.routeParams;
    const { data, t, status } = this.props;

    return (
      <Canon>
        <CanonProfile id="explore-map" data={data} topics={[]}>
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
                    <div className="map-options-row">
                      <MapLevelSelector />
                      <MapScaleSelector />
                      <MapOptions />
                    </div>
                    <MapContent />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CanonProfile>
      </Canon>
    );
  }
}

const mapStateToProps = state => {
  const params = state.map.params;
  return {
    data: state.data,
    results: state.map.results,

    loadedMembers: state.map.options.cubes,

    mapCube: params.measure && params.measure.cube,
    mapCuts: params.cuts,
    mapTopic: params.topic && params.topic.value,
    mapYear: params.year,

    status: state.map.results.status
  };
};

export default translate()(connect(mapStateToProps)(ExploreMap));
