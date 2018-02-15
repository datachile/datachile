import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import "./MapTitle.css";

class MapTitle extends Component {
  static need = [];

  constructor(props) {
    super(props);
  }

  render() {
    const { t, mapLevel, topic, indicator, mapYear } = this.props;
    return (
      <h2 className="map-generated-title">
        {mapLevel && <span>{mapLevel}</span>}
        -
        {topic && <span>{topic.value}</span>}
        -
        {indicator && <span>{indicator.value}</span>}
        -
        {mapYear && <span>{mapYear}</span>}
      </h2>
    );
  }

  toggleChart(level) {}
}

const mapStateToProps = (state, ownProps) => {
  return {
    mapLevel: state.map.level.value,
    mapYear: state.map.year.value,
    topic: state.map.params.topic,
    indicator: state.map.params.indicator
  };
};

MapTitle = translate()(connect(mapStateToProps)(MapTitle));

export default MapTitle;
export { MapTitle };
