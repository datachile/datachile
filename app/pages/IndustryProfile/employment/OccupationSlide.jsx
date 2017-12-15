import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleIndustryDatumNeed } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class OccupationSlide extends Section {
  static need = [
    simpleIndustryDatumNeed(
      "datum_industry_occupation_growth",
      "nene",
      ["Expansion factor"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false }
      }
    ),
    simpleIndustryDatumNeed(
      "datum_industry_occupation_total",
      "nene",
      ["Expansion factor"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        cuts: [`[Date].[Date].[Year].&[${sources.nene.last_year}]`],
        options: { parents: false }
      }
    ),
    simpleIndustryDatumNeed(
      "datum_industry_occupation_female_total",
      "nene",
      ["Expansion factor"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        cuts: [
          `[Date].[Date].[Year].&[${sources.nene.last_year}]`,
          "[Sex].[Sex].[Sex].&[1]"
        ],
        options: { parents: false }
      }
    )
  ];

  render() {
    const { t, i18n, children } = this.props;
    const {
      datum_industry_occupation_total,
      datum_industry_occupation_female_total,
      datum_industry_occupation_growth,
      industry
    } = this.context.data;

    const growth = Math.log(
      datum_industry_occupation_growth[
        datum_industry_occupation_growth.length - 1
      ] / datum_industry_occupation_growth[0]
    );

    const industryName =
      industry.depth === 1 ? industry.name : industry.parent.name;

    const locale = i18n.locale;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Occupation")}</div>
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
              datum={numeral(datum_industry_occupation_total, locale).format(
                "0,0"
              )}
              title={t("Employees in ") + industryName}
              subtitle={`During ${sources.nene.last_year}`}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(
                datum_industry_occupation_female_total /
                  datum_industry_occupation_total,
                locale
              ).format("0.0 %")}
              title={t("Female percent in ") + industryName}
              subtitle={`During ${sources.nene.last_year}`}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(growth, locale).format("0.0 %")}
              title={t("Employment growth")}
              subtitle={`${sources.nene.first_year} - ${
                sources.nene.last_year
              }`}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(OccupationSlide);
