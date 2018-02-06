import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import "./DataSidebar.css";

class DataSidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;

    return (
      <div className="data-sidebar">
        <h1>{t("My Data")}</h1>
        <Link to="/explore/map">Go to mapa</Link>
      </div>
    );
  }
}

DataSidebar = translate()(connect(state => ({}))(DataSidebar));

export default DataSidebar;
export { DataSidebar };
