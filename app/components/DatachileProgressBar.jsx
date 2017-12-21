import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { ProgressBar } from "@blueprintjs/core";
import "./DatachileProgressBar.css";

class DatachileProgressBar extends Component {
  render() {
    const { value } = this.props;
    return (
      <div className="datachile-progress-bar">
        <img className="logo" src="/images/logos/logo-dc.svg" />
        <ProgressBar value={value} />
      </div>
    );
  }
}

DatachileProgressBar = translate()(DatachileProgressBar);

export default DatachileProgressBar;
export { DatachileProgressBar };
