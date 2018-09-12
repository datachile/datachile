import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { ProgressBar } from "@blueprintjs/core";

import "./Loading.css";

class Loading extends Component {
  render() {
    const { progress, t, total } = this.props;

    const description = t("loading.description", { progress, total });
    const value = progress / total;

    return (
      <div className="loading">
        {/* DataChile logo */}
        <img
          className="loading-logo"
          src="/images/logos/logo-dc-beta-small.svg"
          alt="DataChile"
        />

        {/* progress bar & label */}
        <h1 className="u-visually-hidden">{t("table.loading")}</h1>
        <ProgressBar className="loading-progress-bar" value={value} />
        <p className="loading-progress-text font-md heading">{description}</p>

        {/* built by Datawheel */}
        <p className="loading-builtby">
          {t("loading.developed")}
          <span className="u-visually-hidden">Datawheel</span>
          <a
            className="loading-builtby-link"
            href="http://datawheel.us"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="loading-builtby-img font-xxs"
              src="/images/logos/footer/datawheel-logo-white.svg"
              alt=""
            />
          </a>
        </p>
      </div>
    );
  }
}

Loading = translate()(
  connect(state => ({
    total: state.loadingProgress.requests,
    progress: state.loadingProgress.fulfilled
  }))(Loading)
);

export default Loading;
export { Loading };
