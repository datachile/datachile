import React from "react";
import keyBy from "lodash/keyBy";
import sumBy from "lodash/sumBy";
import { Section } from "@datawheel/canon-core";
import { withNamespaces } from "react-i18next";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import InfoLogoItemSNED from "components/InfoLogoItemSNED";
import SourceTooltip from "components/SourceTooltip";

// NOTE: this component is currently not being used

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
          logo: "efectiveness-icon-01",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg efectiveness"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Average") + " " + t("Efectiveness"),
          title: t("Efectiveness"),
          description: t("geo_profile.education.sned.definitions.efectiveness")
        },
        {
          logo: "overcoming-icon-01",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg overcoming"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Average") + " " + t("Overcoming"),
          title: t("Overcoming"),
          description: t("geo_profile.education.sned.definitions.overcoming")
        },
        {
          logo: "initiative-icon-01",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg initiative"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Average") + " " + t("Initiative"),
          title: t("Initiative"),
          description: t("geo_profile.education.sned.definitions.initiative")
        },
        {
          logo: "integration-icon-01",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg integration"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Average") + " " + t("Integration"),
          title: t("Integration"),
          description: t("geo_profile.education.sned.definitions.integration")
        },
        {
          logo: "improvement-icon-01",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg improvement"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Average") + " " + t("Improvement"),
          title: t("Improvement"),
          description: t("geo_profile.education.sned.definitions.improvement")
        },
        {
          logo: "fairness-icon-01",
          value: sned_indicators_data.available
            ? numeral(
                sned_indicators_data.data[0]["Avg fairness"],
                locale
              ).format("0.00")
            : t("no_datum"),
          verb: t("Average") + " " + t("Fairness"),
          title: t("Fairness"),
          description: t("geo_profile.education.sned.definitions.fairness")
        }
      ];
    }

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Performance Evaluation") + " " + t("in") + " "} {geo.name}
            <SourceTooltip cube="sned" />
          </span>
        </h3>
        <div className="info-logo-container info-logo-container-sned">
          {services.map((d, i) => <InfoLogoItemSNED item={d} key={i} />)}
        </div>
      </div>
    );
  }
}

export default withNamespaces()(SNED);
