import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleIndustryDatumNeed } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

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
    )
  ];

  render() {
    const { t, i18n, children } = this.props;
    const { datum_industry_investment } = this.context.data;

    const growth = Math.log(
      datum_industry_investment[datum_industry_investment.length - 1] /
        datum_industry_investment[0]
    );

    const locale = i18n.locale;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Economy")}</div>
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
              datum={numeral(growth, locale).format("0.0 %")}
              title={t("Growth Investment")}
              subtitle={`${sources.tax_data.first_year} - ${
                sources.tax_data.last_year
              }`}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={"xxx k"}
              title={t("Lorem Datum")}
              subtitle="XXXX - YYYY"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={"xxx k"}
              title={t("Lorem Datum")}
              subtitle="XXXX - YYYY"
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(EconomySlide);
