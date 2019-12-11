import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";

class InternationalTradeSlide extends Section {
  static need = [];

  render() {
    const { t, children, i18n } = this.props;
    const locale = i18n.language;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">{t("International Trade")}</h3>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(InternationalTradeSlide);
