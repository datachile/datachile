import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

class InternationalTradeSlide extends Section {
  static need = [];

  render() {
    const { t, children, i18n } = this.props;
    const locale = i18n.language;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("International Trade")}</div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternationalTradeSlide);
