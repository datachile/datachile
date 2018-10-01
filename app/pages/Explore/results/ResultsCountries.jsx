import React from "react";

import ResultsComponent from "./ResultsGeneric";

class ResultsCountries extends ResultsComponent {
  renderChildrenTitle() {
    return this.props.t("Countries");
  }
}

export default ResultsCountries;
