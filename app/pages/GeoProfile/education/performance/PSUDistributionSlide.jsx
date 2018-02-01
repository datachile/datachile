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

class PSUDistributionSlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "datum_performance_psu_average",
        "psu",
        ["PSU Average"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[${sources.psu.year}]`]
        },
        "geo"
      )(params, store),
    (params, store) =>
      simpleDatumNeed(
        "datum_performance_total",
        "psu",
        ["Number of records"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[${sources.psu.year}]`]
        },
        "geo"
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;
    let {
      geo,
      datum_performance_psu_average,
      datum_performance_total
    } = this.context.data;

    const locale = i18n.language;

    const text = {
      year: sources.psu.year,
      geo: geo ? geo.caption : "",
      total: datum_performance_total
        ? numeral(datum_performance_total.data, locale).format("0,0")
        : "",
      avg: datum_performance_psu_average
        ? numeral(datum_performance_psu_average.data, locale).format("0")
        : ""
    };

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Score")}</div>
          <div className="topic-slide-text">
            <p>
              {text && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: t(
                      `geo_profile.education.performance.byPSU.distribution`,
                      text
                    )
                  }}
                />
              )}
              <span
                dangerouslySetInnerHTML={{
                  __html: t(
                    `geo_profile.education.performance.byPSU.disclaimer`
                  )
                }}
              />
            </p>
          </div>
          <div className="topic-slide-data">
            {text &&
              datum_performance_total && (
                <FeaturedDatum
                  className="l-1-2"
                  icon="estudiantes-cantidad"
                  datum={numeral(datum_performance_total.data, locale).format(
                    "0,0"
                  )}
                  title={t("Students that took the PSU")}
                  subtitle={
                    t("In") +
                    " " +
                    sources.psu.year +
                    " " +
                    t(" in ") +
                    geo.caption
                  }
                />
              )}
            {datum_performance_psu_average && (
              <FeaturedDatum
                className="l-1-3"
                icon="promedio-nem"
                datum={numeral(
                  datum_performance_psu_average.data,
                  locale
                ).format("0")}
                title={t("Average PSU")}
                subtitle={
                  t("In") +
                  " " +
                  sources.psu.year +
                  " " +
                  t(" in ") +
                  geo.caption
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

export default translate()(PSUDistributionSlide);
