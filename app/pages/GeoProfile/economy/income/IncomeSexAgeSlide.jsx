import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";
import { calculateYearlyGrowth } from "helpers/dataUtils";
import mondrianClient, {
  geoCut,
  simpleDatumNeed
} from "helpers/MondrianClient";
import { maxMinGrowthByYear } from "helpers/aggregations";
import { getGeoObject } from "helpers/dataUtils";

import FeaturedDatum from "components/FeaturedDatum";

class IncomeSexAgeSlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "datum_income_mean_sex",
        "nesi_income",
        ["Median Income"],
        {
          drillDowns: [["Date", "Date", "Year"], ["Sex", "Sex", "Sex"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${sources.nesi_income.year}]`]
        }
      )(params, store),
    (params, store) => {
      const geo = getGeoObject(params);
      const cube = mondrianClient.cube("nesi_income");
      const prm = cube
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", false)
              .drilldown("Date", "Date", "Year")
              .measure("Median Income"),
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          const result = maxMinGrowthByYear(
            res.data.data,
            "Median Income",
            store.i18n.locale
          );
          return {
            key: "text_income_sex_slide_data",
            data: result
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { children, t } = this.props;

    const locale = this.props.i18n.locale;

    const {
      datum_income_mean_sex,
      geo,
      text_income_sex_slide_data
    } = this.context.data;

    if (text_income_sex_slide_data) {
      text_income_sex_slide_data.geo = this.context.data.geo;
      text_income_sex_slide_data.increased_or_decreased = text_income_sex_slide_data.increased
        ? t("increased")
        : t("decreased");
    }

    var gap;
    var inFavor;
    if (datum_income_mean_sex) {
      gap = calculateYearlyGrowth(datum_income_mean_sex);
      inFavor = gap > 0 ? t("men") : t("women");
    }

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Income")}</div>
          <div className="topic-slide-text">
            <p
              dangerouslySetInnerHTML={{
                __html: t(
                  "geo_profile.income_sex_age_slide.text",
                  text_income_sex_slide_data
                )
              }}
            />
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(datum_income_mean_sex[0], locale).format(
                "($ 0 a)"
              )}
              title={t("Female Mean Income")}
              subtitle={t("in ") + geo.caption}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(datum_income_mean_sex[1], locale).format(
                "($ 0 a)"
              )}
              title={t("Male Mean Income")}
              subtitle={t("in ") + geo.caption}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(Math.abs(gap), locale).format("(0.0%)")}
              title={t("Gender income gap")}
              subtitle={
                t("in favor of ") + inFavor + " in " + sources.nesi_income.year
              }
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(IncomeSexAgeSlide)
);
