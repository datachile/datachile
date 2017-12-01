import React from "react";

import ResultsComponent from "./ResultsGeneric";

class ResultsCountries extends ResultsComponent {
  renderChildrenTitle() {
    return <h4>{this.props.t("Countries")}</h4>;
  }
}

export default ResultsCountries;
