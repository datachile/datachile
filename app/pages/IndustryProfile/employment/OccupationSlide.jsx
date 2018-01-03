import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleIndustryDatumNeed } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import { annualized_growth } from "helpers/calculator";

import FeaturedDatum from "components/FeaturedDatum";

class OccupationSlide extends Section {
  static need = [
    simpleIndustryDatumNeed(
      "datum_industry_occupation_growth",
      "nene_quarter",
      ["Expansion factor"],
      {
        drillDowns: [["Date", "Date", "Moving Quarter"]],
        options: { parents: false }
      }
    ),
    simpleIndustryDatumNeed(
      "datum_industry_occupation_total",
      "nene_quarter",
      ["Expansion factor"],
      {
        drillDowns: [["Date", "Date", "Moving Quarter"]],
        cuts: [
          `[Date].[Date].[Moving Quarter].&[${sources.nene.last_quarter}]`
        ],
        options: { parents: false }
      }
    ),
    simpleIndustryDatumNeed(
      "datum_industry_occupation_female_total",
      "nene_quarter",
      ["Expansion factor"],
      {
        drillDowns: [["Date", "Date", "Moving Quarter"]],
        cuts: [
          `[Date].[Date].[Moving Quarter].&[${sources.nene.last_quarter}]`,
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

    const industryName =
      industry.depth === 1 ? industry.caption : industry.parent.caption;

    const locale = i18n.language;

    const rate = datum_industry_occupation_growth
      ? numeral(
          annualized_growth(datum_industry_occupation_growth),
          locale
        ).format("0.0 %")
      : "";

    const text_slide = {
      increased_or_decreased: rate > 0 ? t("increased") : t("decreased"),
      industry: { caption: industryName },
      rate,
      year: {
        first: sources.nene.first_year,
        last: sources.nene.last_year
      },
      values: {
        first: datum_industry_occupation_growth
          ? numeral(datum_industry_occupation_growth[0], locale).format("0,0a")
          : "",
        last: datum_industry_occupation_growth
          ? numeral(
              datum_industry_occupation_growth[
                datum_industry_occupation_growth.length - 1
              ],
              locale
            ).format("0,0a")
          : ""
      }
    };

    return (
      <div className="topic-slide-block">
        {datum_industry_occupation_total > 0 && (
          <div className="topic-slide-intro">
            <div className="topic-slide-title">
              {t("Occupation")}
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
                    __html: t("industry_profile.employment", text_slide)
                  }}
                />
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
                subtitle={t("During") + " " + sources.nene.last_year}
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
                subtitle={t("During") + " " + sources.nene.last_year}
              />
              <FeaturedDatum
                className="l-1-3"
                icon="industria"
                datum={rate}
                title={t("Employment growth")}
                subtitle={`${sources.nene.first_year} - ${
                  sources.nene.last_year
                }`}
              />
            </div>
          </div>
        )}
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(OccupationSlide);
