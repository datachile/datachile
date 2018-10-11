import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import { simpleIndustryDatumNeed } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { getTopCategories } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

import { annualized_growth } from "helpers/calculator";

import FeaturedDatum from "components/FeaturedDatum";
import { Economy } from "texts/IndustryProfile";

import isEmpty from "lodash/isEmpty";

class EconomySlide extends Section {
  static need = [
    simpleIndustryDatumNeed(
      "datum_industry_investment",
      "tax_data",
      ["Investment"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false }
      }
    ),
    simpleIndustryDatumNeed("datum_industry_labour", "tax_data", ["Labour"], {
      drillDowns: [["Date", "Date", "Year"]],
      options: { parents: false }
    }),
    simpleIndustryDatumNeed(
      "datum_industry_output_by_comuna",
      "tax_data",
      ["Output"],
      {
        drillDowns: [["Tax Geography", "Geography", "Comuna"]],
        options: { parents: true },
        cuts: [`[Date].[Date].[Year].&[${sources.tax_data.last_year}]`]
      },
      false
    )
  ];

  render() {
    const { t, i18n, children } = this.props;
    const {
      datum_industry_investment,
      datum_industry_output_by_comuna,
      datum_industry_labour,
      industry
    } = this.context.data;

    const rate = annualized_growth(datum_industry_investment);
    const locale = i18n.language;

    let text = Economy(datum_industry_output_by_comuna, locale);
    if (text) {
      text = {
        ...text,
        industry,
        year: {
          first: sources.tax_data.first_year,
          last: sources.tax_data.last_year
        },
        rate: numeral(rate, locale).format("0.0%"),
        increased_or_decreased: rate > 0 ? t("increased") : t("decreased")
      };
    }

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">{t("Economy")}</h3>
          <div className="topic-slide-text">
            <p
              dangerouslySetInnerHTML={{
                __html: isEmpty(text.location.first)
                  ? t("industry_profile.economy.no_data", text)
                  : isEmpty(text.location.second)
                    ? t("industry_profile.economy.one_item", text)
                    : t("industry_profile.economy.default", text)
              }}
            />
          </div>

          <div className="topic-slide-data">
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="industria"
                datum={numeral(rate, locale).format("0.0%")}
                title={t("Growth Investment")}
                subtitle={`${sources.tax_data.first_year} - ${
                  sources.tax_data.last_year
                }`}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="industria"
                datum={numeral(
                  datum_industry_labour[datum_industry_labour.length - 1],
                  locale
                ).format("0,0")}
                title={t("Number of jobs")}
                subtitle={t("During") + " " + sources.tax_data.last_year}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="industria"
                datum={numeral(
                  annualized_growth(datum_industry_labour),
                  locale
                ).format("0.0%")}
                title={t("Growth Labour")}
                subtitle={`${sources.tax_data.first_year} - ${
                  sources.tax_data.last_year
                }`}
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(EconomySlide);
