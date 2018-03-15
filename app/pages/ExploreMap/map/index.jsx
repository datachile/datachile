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

import { requestData, requestMembers } from "../actions.js";

import { SyncStateAndLocalStorage } from "helpers/localStorage";
import {
  getCutsFullName,
  stateToPermalink,
  permalinkToState,
  cutStateParser
} from "helpers/map";
import mondrianClient from "helpers/MondrianClient";
import shorthash from "helpers/shorthash";

import { NonIdealState } from "@blueprintjs/core";
import DatachileProgressBar from "components/DatachileProgressBar";

import "../explore-map.css";

class ExploreMap extends React.Component {
  static need = [
    (params, store) => {
      const hasGeoDimensions = dimensions =>
        dimensions.length > 0 &&
        dimensions.some(
          dim =>
            dim.hierarchies.length > 0 &&
            dim.hierarchies.some(hie => hie.name == "Geography")
        );

      const localeCaption = function(key, item) {
        return item.annotations[key] || item.caption || item.name;
      }.bind(null, `${store.i18n.locale}_element_caption`);

      // mondrian-rest-client doesn't use the annotations from the json
      const promise = mondrianClient.cubes().then(cubes => {
        const hierarchies = {};
        const measures = {};

        for (let cube, i = 0; (cube = cubes[i]); i++) {
          if (!hasGeoDimensions(cube.dimensions)) continue;

          const topic = cube.annotations.topic;
          const availableMs = cube.annotations.available_measures
            ? cube.annotations.available_measures.split(",")
            : [];

          measures[topic] = [].concat(
            measures[topic] || [],
            cube.measures
              .filter(ms => availableMs.indexOf(ms.name) > -1)
              .map(ms => ({
                hash: shorthash(ms.name),
                cube: cube.name,
                value: ms.name,
                name: localeCaption(ms)
              }))
          );

          let selectors = [];

          const availableDims = cube.annotations.available_dimensions
            ? cube.annotations.available_dimensions.split(",")
            : [];

          for (let dim, j = 0; (dim = cube.dimensions[j]); j++) {
            if (
              !/Geography$|^Date$/.test(dim.name) &&
              availableDims.indexOf(dim.name) > -1
            ) {
              for (let hier, k = 0; (hier = dim.hierarchies[k]); k++) {
                selectors.push({
                  hash: shorthash(`[${dim.name}].[${hier.name}]`),
                  cube: cube.name,
                  name: localeCaption(dim),
                  value: `[${dim.name}].[${hier.name}]`,
                  isGeo: /country/i.test(dim.name),
                  levels: hier.levels.slice(1).map(lvl => ({
                    hash: shorthash(lvl.name),
                    value: lvl.fullName,
                    name: localeCaption(lvl)
                  }))
                });
              }
            }
          }

          hierarchies[cube.name] = selectors;
        }

        return {
          key: "map_params",
          data: {
            selectors: hierarchies,
            measures: measures
          }
        };
      });

      return { type: "GET_DATA", promise };
    }
  ];

  constructor(props) {
    super(props);

    console.log("ExploreMap is being created");

    const t = props.t;

    const topics = [
      { value: "economy", name: t("Economy") },
      { value: "education", name: t("Education") },
      { value: "environment", name: t("Housing & Environment") },
      { value: "demography", name: t("Demography") },
      { value: "health", name: t("Health") },
      { value: "civics", name: t("Civics") }
    ].map(item => {
      item.hash = shorthash(item.value);
      item.icon = `/images/profile-icon/icon-${item.value}.svg`;
      return item;
    });

    props.dispatch({
      type: "MAP_INIT",
      payload: {
        topics: topics,
        params: permalinkToState(
          props.location.query,
          topics,
          props.data.map_params.measures
        )
      }
    });

    this.state = {
      cutHash: props.location.query.c
    };
  }

  componentDidMount() {
    console.log("ExploreMap was mounted");
  }

  componentWillUnmount() {
    console.log("ExploreMap will be unmounted");
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
      browserHistory.push(this.props.location.pathname + permalinkAfter);
  }

  render() {
    const { section } = this.props.routeParams;
    const { data, t, membersLoading } = this.props;

    let loadingValue = 0;
    loadingValue += Number(this.props.statusData == "LOADING");
    loadingValue += this.props.membersLoaded;
    const loading = loadingValue > 0 || this.state.cutHash ? "loading" : "";

    return (
      <Canon>
        <CanonProfile id="explore-map" data={data} topics={[]}>
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

    statusData: state.map.results.status,
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
