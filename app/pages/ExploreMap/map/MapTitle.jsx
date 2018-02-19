import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import "./MapTitle.css";

class MapTitle extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const { results, setMapTitle } = nextProps;
    if (this.props.results != results) {
      setMapTitle(this.getDatasetTitle());
    }
  }

  getDatasetTitle() {
    const { mapLevel, topic, indicator, results } = this.props;

    var parts = [topic ? topic.value : "", indicator ? indicator.value : ""];

    return parts.join("-");
  }

  render() {
    const { t, mapLevel, mapYear, results } = this.props;

    const title = this.getDatasetTitle();

    return (
      <h2 className="map-generated-title">
        {results.queries.regiones && (
          <span>
            {title}
            {" by " + mapLevel}
            {mapYear && " in " + mapYear}
          </span>
        )}
      </h2>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    mapLevel: state.map.level.value,
    mapYear: state.map.year.value,
    topic: state.map.params.topic,
    indicator: state.map.params.indicator,
    results: state.map.results
  };
};

const mapDispatchToProps = dispatch => ({
  setMapTitle(value) {
    dispatch({
      type: "MAP_SET_TITLE",
      text: value
    });
  }
});

MapTitle = translate()(connect(mapStateToProps, mapDispatchToProps)(MapTitle));

export default MapTitle;
export { MapTitle };
