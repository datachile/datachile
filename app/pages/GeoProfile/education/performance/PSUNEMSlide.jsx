import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { simpleDatumNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";

import FeaturedDatum from "components/FeaturedDatum";
import { numeral } from "helpers/formatters";
import { sources } from "helpers/consts";
import {
  PerformanceByPSU,
  PerformanceByPSUComuna,
  PerformanceByHighSchool
} from "texts/GeoProfile";

import merge from "lodash/merge";

class PSUNEMSlide extends Section {
  static need = [
    (params, store) => {
      let geo = getGeoObject(params);

      if (geo.type === "comuna") {
        return simpleDatumNeed(
          "datum_performance_by_highschool",
          "education_performance_new",
          ["Average PSU"],
          {
            drillDowns: [["Institution", "Institution", "Institution"]],
            options: { parents: true },
            cuts: [
              `[Year].[Year].[Year].&[${
                sources.education_performance_new.year
              }]`
            ]
          },
          "geo",
          false
        )(params, store);
      } else {
        return simpleDatumNeed(
          "datum_performance_by_psu_comuna",
          "education_performance_new",
          ["Average PSU"],
          {
            drillDowns: [["Geography", "Geography", "Comuna"]],
            options: { parents: true },
            cuts: [
              `[Year].[Year].[Year].&[${
                sources.education_performance_new.year
              }]`
            ]
          },
          "geo",
          false
        )(params, store);
      }
    },
    (params, store) =>
      simpleDatumNeed(
        "datum_performance_by_psu",
        "education_performance_new",
        ["Average PSU"],
        {
          drillDowns: [["Institution", "Institution", "Administration"]],
          options: { parents: true },
          cuts: [
            `[Year].[Year].[Year].&[${sources.education_performance_new.year}]`
          ]
        },
        "geo",
        false
      )(params, store),
    (params, store) =>
      simpleDatumNeed(
        "datum_performance_psu_average",
        "education_performance_new",
        ["Average PSU"],
        {
          drillDowns: [["Year", "Year", "Year"]],
          options: { parents: true },
          cuts: [
            `[Year].[Year].[Year].&[${sources.education_performance_new.year}]`
          ]
        },
        "geo"
      )(params, store),
    (params, store) =>
      simpleDatumNeed(
        "datum_performance_nem_average",
        "education_performance_new",
        ["Average NEM"],
        {
          drillDowns: [["Year", "Year", "Year"]],
          options: { parents: true },
          cuts: [
            `[Year].[Year].[Year].&[${sources.education_performance_new.year}]`
          ]
        },
        "geo"
      )(params, store),
    (params, store) =>
      simpleDatumNeed(
        "datum_performance_total",
        "education_performance_new",
        ["Number of records"],
        {
          drillDowns: [["Year", "Year", "Year"]],
          options: { parents: true },
          cuts: [
            `[Year].[Year].[Year].&[${sources.education_performance_new.year}]`
          ]
        },
        "geo"
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;
    let {
      geo,
      datum_performance_by_psu,
      datum_performance_by_psu_comuna,
      datum_performance_by_highschool,
      datum_performance_nem_average,
      datum_performance_psu_average,
      datum_performance_total
    } = this.context.data;

    const locale = i18n.language;

    const perf = PerformanceByPSU(datum_performance_by_psu, geo, locale, t);
    let rank = "";
    if (datum_performance_by_psu_comuna) {
      rank = PerformanceByPSUComuna(datum_performance_by_psu_comuna, locale);
    } else {
      rank = PerformanceByHighSchool(datum_performance_by_highschool, locale);
    }

    const text = merge(perf, rank);

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">Performance</div>
          <div className="topic-slide-text">
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    geo.type === "comuna"
                      ? t(
                          "geo_profile.education.performance.byPSU.level2",
                          text
                        )
                      : t(
                          "geo_profile.education.performance.byPSU.level1",
                          text
                        )
                }}
              />
            </p>
          </div>
          <div className="topic-slide-data">
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="industria"
                datum={numeral(datum_performance_total.data, locale).format(
                  "0,0"
                )}
                title={t("Students enrolled")}
                subtitle={
                  t("In last year of high school in ") +
                  sources.education_performance_new.year
                }
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="industria"
                datum={numeral(
                  datum_performance_nem_average.data,
                  locale
                ).format("0.00")}
                title={t("Average NEM")}
                subtitle={
                  t("In") + " " + sources.education_performance_new.year
                }
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="industria"
                datum={numeral(
                  datum_performance_psu_average.data,
                  locale
                ).format("0,0")}
                title={t("Average PSU")}
                subtitle={
                  t("In") + " " + sources.education_performance_new.year
                }
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(PSUNEMSlide);
