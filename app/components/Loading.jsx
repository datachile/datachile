import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { NonIdealState } from "@blueprintjs/core";

import DatachileProgressBar from "components/DatachileProgressBar";

import "./Loading.css";

class Loading extends Component {
  render() {
    const { progress, t, total } = this.props;
    return (
      <NonIdealState
        className="data-chile-loading"
        title={t("loading.description", { progress, total })}
        description={t("loading.developed")}
        visual={<DatachileProgressBar value={progress / total} />}
      />
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
