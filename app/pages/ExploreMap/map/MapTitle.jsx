import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import "./MapTitle.css";

class MapTitle extends Component {
  componentWillReceiveProps(nextProps) {
    const { measure, setMapTitle } = nextProps;
    if (this.props.measure.name != measure.name) {
      setMapTitle(this.getDatasetTitle(nextProps));
    }
  }

  getDatasetTitle(nextProps) {
    const { topic, indicator, measure } = nextProps;
    return `${topic ? topic.name : ""}, ${indicator ? indicator.name : ""}, ${
      measure ? measure.name : ""
    }`;
  }

  render() {
    const { t, mapTitle, mapLevel, mapYear, query } = this.props;

    const title = query ? (
      <span>{`${mapTitle} by ${mapLevel}${mapYear && " in " + mapYear}`}</span>
    ) : null;

    return <h2 className="map-generated-title">{title}</h2>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    mapTitle: state.map.title,
    mapLevel: state.map.params.level,
    mapYear: state.map.params.year,
    topic: state.map.params.topic,
    indicator: state.map.params.indicator,
    measure: state.map.params.measure,
    query: state.map.results.queries.region
  };
};

const mapDispatchToProps = dispatch => ({
  setMapTitle(payload) {
    dispatch({ type: "MAP_SET_TITLE", payload });
  }
});

MapTitle = translate()(connect(mapStateToProps, mapDispatchToProps)(MapTitle));

export default MapTitle;
export { MapTitle };
