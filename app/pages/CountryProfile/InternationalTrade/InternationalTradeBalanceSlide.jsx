import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleCountryDatumNeed } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { accumulated_growth } from "helpers/aggregations";

import FeaturedDatum from "components/FeaturedDatum";

class InternationalTradeBalanceSlide extends Section {
  static need = [
    simpleCountryDatumNeed(
      "datum_country_exports_per_year",
      "exports",
      ["FOB US"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false }
      }
    ),
    simpleCountryDatumNeed(
      "datum_country_imports_per_year",
      "imports",
      ["CIF US"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false }
      }
    )
  ];

  render() {
    const { t, children, i18n } = this.props;
    const {
      datum_country_imports_per_year,
      datum_country_exports_per_year
    } = this.context.data;
    const locale = i18n.locale;

    console.log(datum_country_imports_per_year)

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">
            {t("International Trade Balance")}
          </div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{
              __html: t("country_profile.intltrade_balance_slide.text")
            }}
          />

          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={accumulated_growth(datum_country_exports_per_year, locale)}
              title={t("Growth Exports")}
              subtitle={
                t("In period") +
                " " +
                sources.exports.min_year +
                "-" +
                sources.exports.year
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={accumulated_growth(datum_country_imports_per_year, locale)}
              title={t("Growth Imports")}
              subtitle={
                t("In period") +
                " " +
                sources.imports.min_year +
                "-" +
                sources.exports.year
              }
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
