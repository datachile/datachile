import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";
import mondrianClient, {
  geoCut,
  simpleGeoDatumNeed
} from "helpers/MondrianClient";
import { maxMinGrowthByYear } from "helpers/aggregations";
import { getGeoObject } from "helpers/dataUtils";

import FeaturedDatum from "components/FeaturedDatum";
import LevelWarning from "components/LevelWarning";

class IncomeSexAgeSlide extends Section {
  static need = [
    (params, store) => {
      let geo = getGeoObject(params);
      //force to region query on comuna profile
      if (geo.type === "comuna") {
        geo = geo.ancestor;
      }
      return simpleGeoDatumNeed(
        "datum_income_mean_sex",
        "nesi_income",
        ["Median Income"],
        {
          drillDowns: [["Date", "Date", "Year"], ["Sex", "Sex", "Sex"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${sources.nesi_income.year}]`]
        },
        true,
        geo
      )(params, store);
    },
    (params, store) => {
      var geo = getGeoObject(params);
      //force to region query on comuna profile
      if (geo.type == "comuna") {
        geo = geo.ancestor;
      }
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
            store.i18n.locale,
            false
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
    const { children, path, t } = this.props;

    const locale = this.props.i18n.language;

    const {
      datum_income_mean_sex,
      geo,
      text_income_sex_slide_data
    } = this.context.data;

    if (text_income_sex_slide_data) {
      text_income_sex_slide_data.geo = geo
        ? geo.depth > 1 ? geo.ancestors[0] : geo
        : {};
      text_income_sex_slide_data.increased_or_decreased = text_income_sex_slide_data.increased
        ? t("increased")
        : t("decreased");
    }

    const name = geo
      ? geo.depth > 1 ? geo.ancestors[0].caption : geo.caption
      : "";

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("Income")}
          </h3>
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
              className="l-1-2"
              icon="ingreso-femenino"
              datum={numeral(datum_income_mean_sex[0], locale).format("($0a)")}
              title={t("Female Median Income")}
              subtitle={t("in ") + name}
            />
            <FeaturedDatum
              className="l-1-2"
              icon="ingreso-masculino"
              datum={numeral(datum_income_mean_sex[1], locale).format("($0a)")}
              title={t("Male Median Income")}
              subtitle={t("in ") + name}
            />
          </div>
          {this.context.data.geo.depth > 1 && (
            <LevelWarning name={name} path={path} />
          )}
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(IncomeSexAgeSlide);
