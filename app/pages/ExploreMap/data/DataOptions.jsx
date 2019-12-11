import React from "react";
import { withNamespaces } from "react-i18next";
import { Link } from "react-router";
import { connect } from "react-redux";

import "./DataOptions.css";

class DataOptions extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div className="data-options">
        <p className="data-title"></p>
        <div className="data-options-container">
          <Link className="option" to="/explore/map">
          <img src="/images/icons/icon-return.svg" />
            {t("Back to Map")}
          </Link>
        </div>
      </div>
    );
  }
}

DataOptions = withNamespaces()(connect()(DataOptions));

export default DataOptions;
export { DataOptions };
