import React from "react";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import { CanonProfile, Canon } from "datawheel-canon";

import { translate } from "react-i18next";
import isEqual from "lodash/isEqual";

import Nav from "components/Nav";

import MapSidebar from "./MapSidebar";
import MapContent from "./MapContent";
import MapLevelSelector from "./MapLevelSelector";
import MapOptions from "./MapOptions";

import {
  requestData,
  requestMembers,
  serializeCuts,
  stateToPermalink
} from "../actions.js";

import { SyncStateAndLocalStorage } from "helpers/localStorage";

import { NonIdealState } from "@blueprintjs/core";
import DatachileProgressBar from "components/DatachileProgressBar";

import "../explore-map.css";

class ExploreMap extends React.Component {
  static need = [MapSidebar];

  constructor(props) {
    super(props);

    console.log("ExploreMap is being created");

    this.permalink = this.props.location.search;
  }

  componentDidMount() {
    console.log("ExploreMap was mounted");
  }

  componentWillUnmount() {
    console.log("ExploreMap will be unmounted");
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    const { loadedMembers, mapCube, mapParams } = nextProps;
    const locale = nextProps.i18n.language;

    const mapCubeChanged = mapCube && this.props.mapCube != mapCube;

    const cutsBefore = serializeCuts(this.props.mapCuts);
    const cutsAfter = serializeCuts(nextProps.mapCuts);

    if (mapCubeChanged || !isEqual(cutsBefore, cutsAfter)) {
      dispatch(
        requestData({
          cubeName: mapCube,
          cuts: cutsAfter,
          locale: locale
        })
      );
    }

    if (mapCubeChanged && !loadedMembers.includes(mapCube))
      dispatch(requestMembers(mapCube, locale));

    const permalinkBefore = stateToPermalink(this.props.mapParams);
    const permalinkAfter = stateToPermalink(nextProps.mapParams);

    // Enabling this makes the permalink change
    // if (!isEqual(permalinkBefore, permalinkAfter))
    //   browserHistory.push(this.props.location.pathname + permalinkAfter);
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
              <div className="explore-map-section">
                <div className="explore-map-sidebar">
                  <MapSidebar data={data} permalink={this.permalink} />
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
                    <MapOptions />
                  </div>
                  <MapContent />
                </div>
              </div>
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

    loadedMembers: state.map.options.cubes,
    status: state.map.results.status,

    mapParams: params,
    mapCube: params.measure && params.measure.cube,
    mapCuts: params.cuts
  };
};

export default translate()(connect(mapStateToProps)(ExploreMap));
