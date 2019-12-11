import React, { Component } from "react";
import { connect } from "react-redux";
import { withNamespaces } from "react-i18next";
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

        {/* needs moar logos */}
        <div className="loading-gobierno">
          <p className="loading-gobierno-label font-xs">{t("loading.by")}</p>
          <span className="u-visually-hidden">
            Gobierno de Chile: Ministerio Secretaría General de la Presidencia;
            División de Gobierno Digital
          </span>
          <img
            className="loading-gobierno-img"
            src="/images/logos/gobierno-2-logo-fill.svg"
            alt=""
          />
        </div>

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
              src="/images/logos/logo-datawheel.svg"
              alt=""
            />
          </a>
        </p>
      </div>
    );
  }
}

Loading = withNamespaces()(
  connect(state => ({
    total: state.loadingProgress.requests,
    progress: state.loadingProgress.fulfilled
  }))(Loading)
);

export default Loading;
export { Loading };
