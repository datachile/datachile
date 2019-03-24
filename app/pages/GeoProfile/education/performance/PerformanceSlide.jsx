import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import FeaturedDatum from "components/FeaturedDatum";

class PerformanceSlide extends Section {
  static need = [];

  render() {
    const { children, t } = this.props;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("Performance")}
          </h3>
          <div className="topic-slide-text">
            <p />
          </div>
          <div className="topic-slide-data">
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(PerformanceSlide);
