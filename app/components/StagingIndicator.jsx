import React from "react";

import "./StagingIndicator.css";

export default () => {
  const staging =
    typeof __STAGING__ !== "undefined" ||
    (typeof __STAGING__ == "boolean" && __STAGING__ !== false)
      ? true
      : false;
  const dev =
    typeof __DEV__ !== "undefined" ||
    (typeof __DEV__ == "boolean" && __DEV__ !== false)
      ? true
      : false;
  const prod =
    typeof __PROD__ !== "undefined" ||
    (typeof __PROD__ == "boolean" && __PROD__ !== false)
      ? true
      : false;
  const className = staging
    ? "staging-indicator-staging"
    : "staging-indicator-dev";

  if (prod) {
    return null;
  } else {
    return <div className={`staging-indicator ${className}`} />;
  }
};
