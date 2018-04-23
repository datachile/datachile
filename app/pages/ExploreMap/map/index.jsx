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

import IntroSlider from "components/IntroSlider";

import { requestData, requestMembers } from "../actions.js";

import { SyncStateAndLocalStorage } from "helpers/localStorage";
import {
  mapCommonNeed,
  getCutsFullName,
  stateToPermalink,
  permalinkToState,
  cutStateParser
} from "helpers/map";

import { NonIdealState } from "@blueprintjs/core";
import DatachileProgressBar from "components/DatachileProgressBar";

import "../explore-map.css";

class ExploreMap extends React.Component {
  static need = [mapCommonNeed];

  state = {
    cutHash: null
  };

  constructor(props) {
    super(props);

    // this prevents the state reset when coming back from the cart
    if (props.mapCube) {
      browserHistory.push(
        "/" + props.location.pathname + stateToPermalink(props.mapParams)
      );
      return;
    }

    const t = props.t;

    const topics = [
      { value: "economy", name: t("Economy") },
      { value: "education", name: t("Education") },
      { value: "environment", name: t("Housing & Environment") },
      { value: "demographics", name: t("Demographics") },
      { value: "health", name: t("Health") },
      { value: "civics", name: t("Civics") }
    ].map(item => {
      item.icon = `/images/profile-icon/icon-${item.value}.svg`;
      return item;
    });

    const measures = ((props.data || {}).map_params || {}).measures;

    props.dispatch({
      type: "MAP_INIT",
      payload: {
        topics: topics,
        params: permalinkToState(props.location.query, topics, measures)
      }
    });

    this.state.cutHash = props.location.query.c;
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    const { mapMemberCubes, mapCube, mapParams } = nextProps;
    const locale = nextProps.i18n.language;

    if (
      this.state.cutHash &&
      Object.keys(nextProps.mapLevelMembers).length > 0
    ) {
      this.setState({ cutHash: null });
      dispatch({
        type: "MAP_INIT_DEFERRED",
        payload: cutStateParser(this.state.cutHash, {
          cube: nextProps.mapCube,
          selectors: nextProps.data.map_params.selectors,
          members: nextProps.mapLevelMembers
        })
      });
    }

    const mapCubeChanged = mapCube && this.props.mapCube != mapCube;

    const cutsBefore = getCutsFullName(this.props.mapCuts);
    const cutsAfter = getCutsFullName(nextProps.mapCuts);

    if (mapCubeChanged || !isEqual(cutsBefore, cutsAfter)) {
      dispatch(
        requestData({
          cubeName: mapCube,
          cuts: cutsAfter,
          locale: locale
        })
      );
    }

    if (mapCubeChanged && !mapMemberCubes.includes(mapCube))
      dispatch(requestMembers(mapCube, locale));

    const permalinkBefore = stateToPermalink(this.props.mapParams);
    const permalinkAfter = stateToPermalink(nextProps.mapParams);

    if (!isEqual(permalinkBefore, permalinkAfter))
      browserHistory.push("/" + this.props.location.pathname + permalinkAfter);
  }

  render() {
    const { data, t, membersLoading, router } = this.props;

    const loadingValue = this.props.dataLoading + this.props.membersLoaded;
    const loading = loadingValue > 0 || this.state.cutHash ? "loading" : "";

    return (
      <Canon>
        <CanonProfile id="explore-map" data={data} topics={[]}>
          <IntroSlider />
          <div className="explore-map-page">
            <Nav title="" typeTitle="" type={false} dark={true} />

            <div className="explore-map-container">
              <div className="explore-map-section">
                <div className="explore-map-sidebar">
                  <MapSidebar data={data} />
                </div>
                <div className="explore-map-content">
                  <NonIdealState
                    className={`explore-map-loading ${loading}`}
                    title={t("loading.map")}
                    description={t("loading.developed")}
                    visual={
                      <DatachileProgressBar
                        value={loadingValue / (membersLoading + 1)}
                      />
                    }
                  />
                  <div className="map-options-row">
                    <MapLevelSelector />
                    <MapOptions />
                  </div>
                  <MapContent router={router} />
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

    dataLoading: Number(state.map.results.status == "LOADING"),
    membersLoading: state.map.options.countLoading,
    membersLoaded: state.map.options.countLoaded,

    mapMemberCubes: state.map.options.cubes,
    mapLevelMembers: state.map.options.members,
    mapParams: params,
    mapCube: params.measure && params.measure.cube,
    mapCuts: params.cuts
  };
};

export default translate()(connect(mapStateToProps)(ExploreMap));
