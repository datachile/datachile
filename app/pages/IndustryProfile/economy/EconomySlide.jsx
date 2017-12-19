import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleIndustryDatumNeed } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { getTopCategories } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

import { calculateYearlyGrowth } from "helpers/dataUtils";

import FeaturedDatum from "components/FeaturedDatum";

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

    const top = getTopCategories(datum_industry_output_by_comuna, "Output", 2);
    const rate = calculateYearlyGrowth(datum_industry_investment);
    const total = datum_industry_output_by_comuna.reduce((all, item) => {
      return all + item["Output"];
    }, 0);
    const locale = i18n.locale;

    const text_economy = {
      territory: {
        name: {
          first: top[0].Comuna,
          second: top[1].Comuna
        },
        share: {
          first: numeral(top[0].Output / total).format("0.0 %"),
          second: numeral(top[1].Output / total).format("0.0 %")
        }
      },
      year: {
        first: sources.tax_data.first_year,
        last: sources.tax_data.last_year
      },
      rate: numeral(rate, locale).format("0.0 %"),
      increased_or_decreased: rate > 0 ? "increased" : "decreased",
      industry: {
        name: industry.name
      }
    };

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Economy")}</div>
          <div className="topic-slide-text">
            <span
              dangerouslySetInnerHTML={{
                __html: t("industry_profile.economy", text_economy)
              }}
            />
          </div>

          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(rate, locale).format("0.0 %")}
              title={t("Growth Investment")}
              subtitle={`${sources.tax_data.first_year} - ${
                sources.tax_data.last_year
              }`}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(
                datum_industry_labour[datum_industry_labour.length - 1],
                locale
              ).format("0,0")}
              title={t("Number of jobs")}
              subtitle={`In ${sources.tax_data.last_year}`}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(
                calculateYearlyGrowth(datum_industry_labour),
                locale
              ).format("0.0 %")}
              title={t("Growth Labour")}
              subtitle={`${sources.tax_data.first_year} - ${
                sources.tax_data.last_year
              }`}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(EconomySlide);
