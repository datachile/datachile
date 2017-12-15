import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import FeaturedDatum from "components/FeaturedDatum";

class InternationalTradeBalanceSlide extends Section {
  static need = [];

  render() {
    const { children, t } = this.props;

    const { country } = this.context.data;

    const txt_slide = t("country_profile.intltrade_balance_slide.text", {
      level: country.caption,
      year: {
        first: "year.first".toUpperCase(),
        last: "year.last".toUpperCase()
      },
      import: {
        growth: "import.growth".toUpperCase(),
        direction: "import.direction".toUpperCase(),
        volume_first: "import.volume_first".toUpperCase(),
        volume_last: "import.volume_last".toUpperCase()
      },
      export: {
        growth: "export.growth".toUpperCase(),
        direction: "export.direction".toUpperCase(),
        volume_first: "export.volume_first".toUpperCase(),
        volume_last: "export.volume_last".toUpperCase()
      }
    });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">
            {t("International Trade Balance")}
          </div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />

          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={"x"}
              title={t("Trade volume")}
              subtitle="XXXX - YYYY"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={"x"}
              title={t("Trade volume")}
              subtitle="XXXX - YYYY"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={"x"}
              title={t("Trade volume")}
              subtitle="XXXX - YYYY"
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternationalTradeBalanceSlide);
