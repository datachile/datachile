import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";
import { IndustryActivity, IndustryOccupation } from "texts/GeoProfile";

import { simpleDatumNeed, simpleGeoDatumNeed } from "helpers/MondrianClient";
import merge from "lodash/merge";

class IndustrySlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "datum_industry_by_labour_productivity",
        "tax_data",
        ["Production per worker"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[${sources.tax_data.year}]`]
        },
        "geo"
      )(params, store),
    (params, store) =>
      simpleDatumNeed(
        "datum_industry_by_activity",
        "tax_data",
        ["Output"],
        {
          drillDowns: [["ISICrev4", "ISICrev4", "Level 1"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[${sources.tax_data.year}]`]
        },
        "geo",
        false
      )(params, store),
    (params, store) =>
      simpleDatumNeed(
        "datum_industry_by_occupation",
        "nesi_income",
        ["Expansion Factor"],
        {
          drillDowns: [["ISCO", "ISCO", "ISCO"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[${sources.nesi_income.year}]`]
        },
        "geo",
        false
      )(params, store),
    simpleGeoDatumNeed("datum_industry_output", "tax_data", ["Investment"], {
      drillDowns: [["Date", "Date", "Year"]],
      options: { parents: false },
      cuts: [`[Date].[Date].[Year].&[${sources.tax_data.year}]`]
    }),
    simpleGeoDatumNeed(
      "datum_industry_income_mean",
      "nesi_income",
      ["Median Income"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false },
        cuts: [`[Date].[Date].[Year].&[${sources.nesi_income.year}]`]
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;

    const {
      datum_industry_output,
      datum_industry_income_mean,
      datum_industry_by_activity,
      datum_industry_by_occupation,
      datum_industry_by_labour_productivity,
      geo
    } = this.context.data;

    const locale = i18n.language;

    const activity = IndustryActivity(
      datum_industry_by_activity,
      geo,
      locale,
      t
    );
    const occupation = IndustryOccupation(
      datum_industry_by_occupation,
      locale,
      t
    );
    let text = merge(activity, occupation);
    if (text && datum_industry_by_labour_productivity) {
      text.labour_productivity = numeral(
        datum_industry_by_labour_productivity.data,
        locale
      ).format("$0,,0.[0] a");
    }

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("Industry")}
          </h3>
          <div className="topic-slide-text">
            <span
              dangerouslySetInnerHTML={{
                __html: t("geo_profile.economy.industry", text)
              }}
            />
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-2"
              icon="inversion"
              datum={numeral(datum_industry_output, locale).format(
                "($0,.00a)"
              )}
              title={t("Total Investment")}
              subtitle={sources.tax_data.year}
            />

            <FeaturedDatum
              className="l-1-2"
              icon="ingresos"
              datum={numeral(datum_industry_income_mean, locale).format(
                "($0,0)"
              )}
              title={t("Mean Income")}
              subtitle={sources.nesi_income.year}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(IndustrySlide);
