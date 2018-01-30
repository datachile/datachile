import React from "react";

import "./StagingIndicator.css";

export default () => {
  const staging = typeof __STAGING__ !== "undefined" ? true : false;
  const dev = typeof __DEV__ !== "undefined" ? true : false;
  const className = staging
    ? "staging-indicator-staging"
    : "staging-indicator-dev";
  if (staging || dev) {
    return <div className={`staging-indicator ${className}`} />;
  } else {
    return null;
  }
};
