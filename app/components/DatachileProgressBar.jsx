import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { ProgressBar } from "@blueprintjs/core";
import "./DatachileProgressBar.css";

class DatachileProgressBar extends Component {
  render() {
    const { description, t, value } = this.props;
    return (
      <div className="datachile-progress-bar">
        <img className="logo" src="/images/logos/logo-dc-beta-small.svg" />
        <ProgressBar value={value} />
        <p>{description}</p>
        <p className="builtby">
          {t("loading.developed")}
          <span className="u-visually-hidden">Datawheel</span>
          <a className="builtby-link" href="http://datawheel.us">
            <img
              className="builtby-img"
              src="/images/logos/footer/datawheel-logo-white.svg"
              alt=""
            />
          </a>
        </p>
      </div>
    );
  }
}

DatachileProgressBar = translate()(DatachileProgressBar);

export default DatachileProgressBar;
export { DatachileProgressBar };
