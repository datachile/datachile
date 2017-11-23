import React from "react";
import { connect } from "react-redux";

import "datawheel-canon/src/components/LoadingComponent.css"

const LoadingWithProgress = props => (
    <div className="loading-component">
    <span className="loading-text">
    Loading... ({props.fulfilled}/{props.requests})
    </span>
  </div>
);

export default connect(state => ({
  requests: state.loadingProgress.requests,
  fulfilled: state.loadingProgress.fulfilled
}))(LoadingWithProgress);
