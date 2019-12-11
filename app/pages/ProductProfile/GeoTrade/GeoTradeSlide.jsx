import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";

class GeoTradeSlide extends Section {
  static need = [];

  render() {
    const { children, t } = this.props;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">{t("Geo trade")}</h3>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(GeoTradeSlide);
