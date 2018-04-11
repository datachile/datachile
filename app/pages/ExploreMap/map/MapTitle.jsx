import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import "./MapTitle.css";

class MapTitle extends Component {
  constructor(props) {
    super(props);

    props.setMapTitle(this.getDatasetTitle(props));
  }

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
      if (values.length > 0) {
        finalCuts.push(
          property.replace(/[\[\]']+/g, "") +
            t(" is ") +
            values.map(v => v.name).join(", ")
        );
      }
    }
    if (finalCuts.length == 0) {
      return " total";
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
      <span>{`${mapTitle} ${t(" by ")} ${mapLevel}${mapYear &&
        t(" in ") + mapYear}`}</span>
    ) : null;

    return <p className="map-generated-title">{title}</p>;
  }
}

const mapStateToProps = (state, ownProps) => {
  const params = state.map.params;
  return {
    mapTitle: state.map.title,
    mapLevel: params.level,
    mapYear: params.year[params.level],
    topic: params.topic,
    measure: params.measure,
    cuts: params.cuts,
    query: state.map.results.queries.region
  };
};

const mapDispatchToProps = dispatch => ({
  setMapTitle(payload) {
    dispatch({ type: "MAP_SET_TITLE", payload });
  }
});

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapTitle)
);
