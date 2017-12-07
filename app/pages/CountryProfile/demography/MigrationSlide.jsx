import React from "react";
import { connect } from "react-redux";
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
          <div className="topic-slide-text">
            Aliquam erat volutpat. Nunc eleifend leo vitae magna. In id erat non
            orci commodo lobortis. Proin neque massa, cursus ut, gravida ut,
            lobortis eget, lacus. Sed diam. Praesent fermentum tempor tellus.
            Nullam tempus. Mauris ac felis vel velit tristique imperdiet. Donec
            at pede. Etiam vel neque nec dui dignissim bibendum. Vivamus id
            enim. Phasellus neque orci, porta a, aliquet quis, semper a, massa.
            Phasellus purus. Pellentesque tristique imperdiet tortor. Nam
            euismod tellus id erat.
          </div>
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

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(MigrationSlide)
);
