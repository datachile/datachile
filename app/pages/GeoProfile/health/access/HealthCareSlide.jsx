import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import flattenDeep from "lodash/flattenDeep";

import { sources } from "helpers/consts";

import { getGeoObject } from "helpers/dataUtils";

import mondrianClient, {
  geoCut,
  simpleDatumNeed
} from "helpers/MondrianClient";
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
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const { datum_health_access } = this.context.data;
    const locale = i18n.locale;

    let geo = this.context.data.geo;
    if (geo.type === "comuna") {
      geo = { ...geo.ancestors[0] };
    }

    const share_specialized_healthcare =
      datum_health_access[0]["Specialized Healthcare SUM"] /
      (datum_health_access[0]["Specialized Healthcare SUM"] +
        datum_health_access[0]["Primary Healthcare SUM"]);

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Access")}</div>
          <div className="topic-slide-text">
            Aliquam erat volutpat. Nunc eleifend leo vitae magna. In id erat non
            orci commodo lobortis. Proin neque massa, cursus ut, gravida ut,
            lobortis eget, lacus. Sed diam. Praesent fermentum tempor tellus.
            Nullam tempus. Mauris ac felis vel velit tristique imperdiet. Donec
            at pede. Etiam vel neque nec dui dignissim bibendum. Vivamus id
            enim. Phasellus neque orci, porta a, aliquet quis, semper a, massa.
            Phasellus purus. Pellentesque tristique imperdiet tortor. Nam
            euismod tellus id erat.
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
