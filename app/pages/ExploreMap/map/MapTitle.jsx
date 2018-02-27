import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import "./MapTitle.css";

class MapTitle extends Component {
  componentWillReceiveProps(nextProps) {
    const { measure, setMapTitle, cuts } = nextProps;
    if (this.props.measure.name != measure.name || this.props.cuts != cuts) {
      setMapTitle(this.getDatasetTitle(nextProps));
    }
  }

  cutsToText(cuts) {
    const { t } = this.props;
    var finalCuts = [];
    for (var property in cuts) {
      var values = cuts[property];
      finalCuts.push(
        property.replace(/[\[\]']+/g, "") +
          t(" is ") +
          values.map(v => v.name).join(", ")
      );
    }
    if (finalCuts.length == 0) {
      return "";
    }
    return " " + t("where") + " " + finalCuts.join(", ");
  }

  getDatasetTitle(nextProps) {
    const { topic, measure, cuts } = nextProps;
    return `${topic ? topic.name : ""} \u203a ${
      measure ? measure.name : ""
    } ${this.cutsToText(cuts)}`;
  }

  render() {
    const { t, mapTitle, mapLevel, mapYear, query } = this.props;

    const title = query ? (
      <span>{`${mapTitle} by ${mapLevel}${mapYear && " in " + mapYear}`}</span>
    ) : null;

    return <p className="map-generated-title">{title}</p>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    mapTitle: state.map.title,
    mapLevel: state.map.params.level,
    mapYear: state.map.params.year,
    topic: state.map.params.topic,
    measure: state.map.params.measure,
    cuts: state.map.params.cuts,
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
