import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";

import { calculateYearlyGrowth } from "helpers/dataUtils";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class HealthCareSlide extends Section {
  static need = [
    simpleDatumNeed(
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
        cuts: [`[Date].[Date].[Year].&[${sources.health_access.year}]`]
      },
      false
    ),
    simpleDatumNeed(
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
    const { children, t, i18n } = this.props;
    const {
      datum_health_access,
      datum_health_access_specialized_per_year
    } = this.context.data;
    const locale = i18n.locale;

    let geo = this.context.data.geo;
    if (geo.type === "comuna") {
      geo = { ...geo.ancestors[0] };
    }

    const share_specialized_healthcare =
      datum_health_access[0]["Specialized Healthcare SUM"] /
      (datum_health_access[0]["Specialized Healthcare SUM"] +
        datum_health_access[0]["Primary Healthcare SUM"]);

    const text_healthcare = {
      geo,
      year: {
        first: 2010,
        last: sources.health_access.year
      },
      healthcare: {
        urgency: {
          total: numeral(
            datum_health_access[0]["Urgency Healthcare SUM"],
            locale
          ).format("0,0")
        },
        specialized: {
          rate: numeral(
            calculateYearlyGrowth(datum_health_access_specialized_per_year),
            locale
          ).format("0.0 %"),
          share: numeral(share_specialized_healthcare, locale).format("0.0 %")
        }
      }
    };

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Access")}</div>
          <div className="topic-slide-text">
            <span
              dangerouslySetInnerHTML={{
                __html: t("geo_profile.health.healthcare", text_healthcare)
              }}
            />
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="health-dental"
              datum={numeral(
                datum_health_access[0][
                  "Dental Discharges Per 100 inhabitants AVG"
                ],
                locale
              ).format("0,0")}
              title={t("Dental Discharges")}
              subtitle={t("Per 100 inhabitants in") + " " + geo.name}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="health-firstaid"
              datum={numeral(share_specialized_healthcare, locale).format(
                "0.0 %"
              )}
              title={t("Specialized Healthcares")}
              subtitle={t("During") + " " + sources.health_access.year}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="health-urgency"
              datum={numeral(
                datum_health_access[0]["Urgency Healthcare AVG"],
                locale
              ).format("0,0")}
              title={t("Urgency Healthcare Average")}
              subtitle={t("in") + " " + geo.name}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(HealthCareSlide);
