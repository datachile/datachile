import React from "react";
import keyBy from "lodash/keyBy";
import sumBy from "lodash/sumBy";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import InfoLogoItem from "components/InfoLogoItem";
import SourceNote from "components/SourceNote";

class SNED extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "sned_indicators_data",
        "education_sned",
        [
          "Avg efectiveness",
          "Avg overcoming",
          "Avg initiative",
          "Avg integration",
          "Avg improvement",
          "Avg fairness",
          "Avg sned_score"
        ],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[2016]`]
        },
        "geo",
        false
      )(params, store)
  ];

  render() {
    const { t, className, i18n } = this.props;
    const sned_indicators_data = this.context.data.sned_indicators_data;

    const locale = i18n.language;
    const geo = this.context.data.geo;

    var services = [];

    if (sned_indicators_data) {
      services = [
        {
          logo: "public-transportation",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg efectiveness"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Avg efectiveness"),
          title: t("Efectiveness")
        },
        {
          logo: "educational-center",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg overcoming"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Avg overcoming"),
          title: t("overcoming")
        },
        {
          logo: "health-center",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg initiative"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Avg initiative"),
          title: t("initiative")
        },
        {
          logo: "market",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg integration"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Avg integration"),
          title: t("integration")
        },
        {
          logo: "atm",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg improvement"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Avg improvement"),
          title: t("improvement")
        },
        {
          logo: "sports-center",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg fairness"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Avg fairness"),
          title: t("fairness")
        }
      ];
    }

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Performance evaluation in ")} {geo.name}
          </span>
        </h3>
        <div className="info-logo-container">
          {services.map((d, i) => <InfoLogoItem item={d} key={i} />)}
        </div>
        <SourceNote cube="sned" />
      </div>
    );
  }
}

export default translate()(SNED);
