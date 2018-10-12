import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import { sources } from "helpers/consts";
import { annualized_growth } from "helpers/calculator";

import { simpleGeoDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";

import FeaturedDatum from "components/FeaturedDatum";
import LevelWarning from "components/LevelWarning";

class HealthCareSlide extends Section {
  static need = [
    (params, store) => {
      let geo = getGeoObject(params);

      if (geo.type === "comuna") {
        geo = geo.ancestor;
      }

      const year =
        parseInt(geo.key) === 9
          ? sources.health_access.year - 1
          : sources.health_access.year;

      return simpleGeoDatumNeed(
        "datum_health_access",
        "health_access",
        [
          "Dental Discharges Per 100 inhabitants AVG",
          "Primary Healthcare AVG",
          "Specialized Healthcare AVG",
          "Urgency Healthcare AVG",
          "Primary Healthcare SUM",
          "Specialized Healthcare SUM",
          "Urgency Healthcare SUM"
        ],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${year}]`]
        },
        false
      )(params, store);
    },

    simpleGeoDatumNeed(
      "datum_health_access_specialized_per_year",
      "health_access",
      ["Specialized Healthcare SUM"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false }
      }
    )
  ];

  render() {
    const { children, path, t, i18n } = this.props;
    const {
      datum_health_access,
      datum_health_access_specialized_per_year
    } = this.context.data;
    const locale = i18n.language;

    let geo = this.context.data.geo;

    if (geo.type === "comuna") {
      geo = { ...geo.ancestors[0] };
    }

    const share_specialized_healthcare =
      datum_health_access && datum_health_access.length > 0
        ? datum_health_access[0]["Specialized Healthcare SUM"] /
          (datum_health_access[0]["Specialized Healthcare SUM"] +
            datum_health_access[0]["Primary Healthcare SUM"])
        : t("No data");

    const text_healthcare =
      datum_health_access && datum_health_access.length > 0
        ? {
            geo,
            year: {
              first: 2010,
              last:
                parseInt(geo.key) === 9
                  ? sources.health_access.year - 1
                  : sources.health_access.year
            },
            healthcare: {
              urgency: {
                total:
                  datum_health_access.length > 0
                    ? numeral(
                        datum_health_access[0]["Urgency Healthcare SUM"],
                        locale
                      ).format("0,0")
                    : t("No data")
              },
              specialized: {
                rate:
                  datum_health_access.length > 0
                    ? numeral(
                        annualized_growth(
                          datum_health_access_specialized_per_year
                        ),
                        locale
                      ).format("0.0%")
                    : t("No data"),
                share:
                  datum_health_access.length > 0
                    ? numeral(share_specialized_healthcare, locale).format(
                        "0.0%"
                      )
                    : t("No data")
              }
            }
          }
        : {};

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title">{t("Healthcare by Type")}</h3>
          <div className="topic-slide-text">
            <p
              dangerouslySetInnerHTML={{
                __html: t("geo_profile.health.healthcare", text_healthcare)
              }}
            />
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="health-dental"
              datum={
                datum_health_access.length > 0
                  ? numeral(
                      datum_health_access[0][
                        "Dental Discharges Per 100 inhabitants AVG"
                      ],
                      locale
                    ).format("0,0")
                  : t("no_datum")
              }
              title={t("Dental Discharges")}
              subtitle={t("Per 100 inhabitants in") + " " + geo.name}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="health-firstaid"
              datum={numeral(share_specialized_healthcare, locale).format(
                "0.0%"
              )}
              title={t("Specialized Healthcares")}
              subtitle={t("During") + " " + sources.health_access.year}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="atencion-servicio-urgencia"
              datum={
                datum_health_access.length > 0
                  ? numeral(
                      datum_health_access[0]["Urgency Healthcare AVG"],
                      locale
                    ).format("0,0")
                  : t("no_datum")
              }
              title={t("Urgency Healthcare")}
              subtitle={t("in") + " " + geo.name}
            />
          </div>
          {this.context.data.geo.depth > 1 && (
            <LevelWarning name={this.context.data.geo.ancestors[0].caption} path={path} />
          )}
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(HealthCareSlide);
