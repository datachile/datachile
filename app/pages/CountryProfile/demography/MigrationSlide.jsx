import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import FeaturedDatum from "components/FeaturedDatum";

import { simpleCountryDatumNeed } from "helpers/MondrianClient";
import { calculateYearlyGrowth } from "helpers/dataUtils";
import { sources } from "helpers/consts";

import { numeral } from "helpers/formatters";

class MigrationSlide extends Section {
  static need = [
    (params, store) =>
      simpleCountryDatumNeed(
        "datum_migration_origin_female",
        "immigration",
        ["Number of visas"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [
            `[Date].[Date].[Year].&[${sources.immigration.year}]`,
            `[Sex].[Sex].[Sex].&[1]`
          ]
        }
      )(params, store),
    (params, store) =>
      simpleCountryDatumNeed(
        "datum_migration_origin",
        "immigration",
        ["Number of visas"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [
            `{[Date].[Date].[Year].&[${sources.immigration.year -
              1}],[Date].[Date].[Year].&[${sources.immigration.year}]}`
          ]
        }
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;
    const {
      datum_migration_origin,
      datum_migration_origin_female
    } = this.context.data;
    const locale = i18n.locale;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Migration")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{
              __html: t("country_profile.migration_slide.text")
            }}
          />
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(datum_migration_origin[1], locale).format("(0,0)")}
              title={t("Immigrant visas")}
              subtitle={t("granted in") + " " + sources.immigration.year}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(
                datum_migration_origin_female / datum_migration_origin[1],
                locale
              ).format("(0.0 %)")}
              title={t("Female percent of visas")}
              subtitle={t("granted in") + " " + sources.immigration.year}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(
                calculateYearlyGrowth(datum_migration_origin),
                locale
              ).format("0.0 %")}
              title={t("Growth number of visas")}
              subtitle={
                t("In period") +
                " " +
                (sources.immigration.year - 1) +
                "-" +
                sources.immigration.year
              }
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(MigrationSlide);
