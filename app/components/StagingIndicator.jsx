import React from "react";

import "./StagingIndicator.css";

export default () =>
  typeof __STAGING__ !== "undefined" ? (
    <div className="staging-indicator" />
  ) : null;
