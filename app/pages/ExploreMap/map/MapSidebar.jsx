import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import "./MapSidebar.css";

class MapSidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;

    return (
      <div className="map-sidebar">
        <h1>{t("Map")}</h1>
        <Link to="/explore/map/data">Go to data</Link>
      </div>
    );
  }
}

MapSidebar = translate()(connect(state => ({}))(MapSidebar));

export default MapSidebar;
export { MapSidebar };
