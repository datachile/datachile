import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleIndustryDatumNeed } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class RDSlide extends Section {
  static need = [
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
    const {
      datum_industry_rd_spending,
      datum_industry_rd_exports,
      datum_industry_rd_sales_last_year,
      industry
    } = this.context.data;

    const growth = Math.log(
      datum_industry_rd_spending[datum_industry_rd_spending.length - 1] /
        datum_industry_rd_spending[0]
    );

    const industryName =
      industry.depth === 1 ? industry.name : industry.parent.name;

    const locale = i18n.locale;
    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Research & Development")}</div>
          <div className="topic-slide-text">
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec
              hendrerit tempor tellus. Donec pretium posuere tellus. Proin quam
              nisl, tincidunt et, mattis eget, convallis nec, purus. Cum sociis
              natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus.
            </p>
          </div>

          <div className="topic-slide-data">
          <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(datum_industry_rd_exports, locale).format(
                "$ 0.0 a"
              )}
              title={t("Exports in ") + industryName}
              subtitle={`During ${sources.rd_survey.last_year}`}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(datum_industry_rd_sales_last_year, locale).format(
                "$ 0.0 a"
              )}
              title={t("Sales in ") + industryName}
              subtitle={`During ${sources.rd_survey.last_year}`}
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
