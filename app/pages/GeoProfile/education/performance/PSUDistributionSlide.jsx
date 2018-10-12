import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";
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
        "datum_distribution_psu_average",
        "psu",
        ["PSU Average"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${sources.psu.year}]`]
        },
        "geo"
      )(params, store),
    (params, store) =>
      simpleDatumNeed(
        "datum_distribution_psu_total",
        "psu",
        ["Number of records"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${sources.psu.year}]`]
        },
        "geo"
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;
    let {
      geo,
      datum_distribution_psu_average,
      datum_distribution_psu_total
    } = this.context.data;

    const locale = i18n.language;

    const text = {
      year: sources.psu.year,
      geo: geo ? geo.caption : "",
      total: datum_distribution_psu_total
        ? numeral(datum_distribution_psu_total.data, locale).format("0,0")
        : "",
      avg: datum_distribution_psu_average
        ? numeral(datum_distribution_psu_average.data, locale).format("0,0")
        : ""
    };

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">{t("Score")}</h3>
          <div className="topic-slide-text">
            {text && (
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    `geo_profile.education.performance.byPSU.distribution`,
                    text
                  )
                }}
              />
            )}
          </div>
          <div className="topic-slide-data">
            {text &&
              datum_distribution_psu_total && (
                <FeaturedDatum
                  className="l-1-2"
                  icon="estudiantes-cantidad"
                  datum={numeral(
                    datum_distribution_psu_total.data,
                    locale
                  ).format("0,0")}
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
            {datum_distribution_psu_average && (
              <FeaturedDatum
                className="l-1-3"
                icon="promedio-nem"
                datum={numeral(
                  geo.type == "country"
                    ? 500
                    : datum_distribution_psu_average.data,
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

          <h4 className="topic-slide-context-subhead">
            {t("About the PSU average")}
          </h4>
          <p className="font-xxs">
            {t(`geo_profile.education.performance.byPSU.disclaimer`)}
          </p>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(PSUDistributionSlide);
