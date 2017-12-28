import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

import { simpleDatumNeed } from "helpers/MondrianClient";

class IndustrySlide extends Section {
  static need = [
    simpleDatumNeed("datum_industry_output", "tax_data", ["Investment"], {
      drillDowns: [["Date", "Date", "Year"]],
      options: { parents: false },
      cuts: [`[Date].[Date].[Year].&[${sources.tax_data.year}]`]
    }),
    simpleDatumNeed(
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
      datum_industry_income_mean
    } = this.context.data;

    const locale = i18n.language;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Industry")}</div>
          <div className="topic-slide-text">text</div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-2"
              icon="industria"
              datum={numeral(datum_industry_output, locale).format(
                "($ 0.00 a)"
              )}
              title={t("Total Investment")}
              subtitle={sources.tax_data.year}
            />

            <FeaturedDatum
              className="l-1-2"
              icon="empleo"
              datum={numeral(datum_industry_income_mean, locale).format(
                "($ 0,0)"
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
