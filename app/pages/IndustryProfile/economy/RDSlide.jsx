import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { annualized_growth } from "helpers/calculator";
import {
  simpleDatumNeed,
  simpleIndustryDatumNeed
} from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class RDSlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "datum_total_rd_exports_chile",
        "rd_survey",
        ["exports"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${sources.rd_survey.last_year}]`]
        },
        "no_cut"
      )(params, store),
    simpleIndustryDatumNeed(
      "datum_industry_rd_spending",
      "rd_survey",
      ["Total Spending"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false }
      }
    ),
    simpleIndustryDatumNeed(
      "datum_industry_rd_exports",
      "rd_survey",
      ["exports"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        cuts: [`[Date].[Date].[Year].&[${sources.rd_survey.last_year}]`],
        options: { parents: false }
      }
    ),
    simpleIndustryDatumNeed(
      "datum_industry_rd_sales_last_year",
      "rd_survey",
      ["sales"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        cuts: [`[Date].[Date].[Year].&[${sources.rd_survey.last_year}]`],
        options: { parents: false }
      }
    )
  ];

  render() {
    const { t, i18n, children } = this.props;
    let {
      datum_total_rd_exports_chile,
      datum_industry_rd_spending,
      datum_industry_rd_exports,
      datum_industry_rd_sales_last_year,
      industry
    } = this.context.data;

    const growth = annualized_growth(datum_industry_rd_spending);

    const industryName =
      industry.depth === 1 ? industry.caption : industry.parent.caption;

    const locale = i18n.language;

    const text_rd = {
      year: sources.rd_survey.last_year,
      industry: {
        caption: industryName,
        exports: numeral(datum_industry_rd_exports, locale).format("$0,.0 a"),
        spending: numeral(
          datum_industry_rd_spending[datum_industry_rd_spending.length - 1],
          locale
        ).format("$0,.0 a"),
        share: numeral(
          datum_industry_rd_exports / datum_total_rd_exports_chile.data,
          locale
        ).format("0.0 %")
      }
    };

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">
            {t("Research & Development")}
            {industry.depth > 1 ? (
              <div className="topic-slide-subtitle">
                <p>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t(
                        "industry_profile.warning",
                        industry.depth > 1 ? industry.parent : industry
                      )
                    }}
                  />
                </p>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="topic-slide-text">
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("industry_profile.r&d", text_rd)
                }}
              />
            </p>
          </div>

          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(datum_industry_rd_exports, locale).format(
                "$0,.0 a"
              )}
              title={t("Exports in ") + industryName}
              subtitle={t("During") + " " + sources.rd_survey.last_year}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(datum_industry_rd_sales_last_year, locale).format(
                "$0,.0 a"
              )}
              title={t("Sales in ") + industryName}
              subtitle={t("During") + " " + sources.rd_survey.last_year}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(growth, locale).format("0.0 %")}
              title={t("Growth R&D Spending in ") + industryName}
              subtitle={`${sources.rd_survey.first_year} - ${
                sources.rd_survey.last_year
              }`}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(RDSlide);
