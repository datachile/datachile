import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import "./MapContent.css";

class MapContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;

    return (
      <div className="map-content">
        <img src="https://webassets2.tomtom.com/image/635829973946670771BD.png" />
      </div>
    );
  }
}

MapContent = translate()(connect(state => ({}))(MapContent));

export default MapContent;
export { MapContent };
