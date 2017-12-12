import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import FeaturedDatum from "components/FeaturedDatum";

class GeoTradeSlide extends Section {
  static need = [];

  render() {
    const { children, t } = this.props;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(GeoTradeSlide);
