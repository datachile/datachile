import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import flattenDeep from "lodash/flattenDeep";

import { sources } from "helpers/consts";

import { getGeoObject } from "helpers/dataUtils";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class HealthCareSlide extends Section {
  static need = [
    (params, store) => {
      let geo = getGeoObject(params);
      if (geo.type === "comuna") {
        geo = { ...geo.ancestor };
      }
      const prm = mondrianClient
        .cube("health_access")
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", false)
              .drilldown("Date", "Date", "Year")
              .measure("Primary Healthcare AVG")
              .measure("Specialized Healthcare AVG")
              .measure("Urgency Healthcare AVG")
              .cut(
                `[Date].[Date].[Year].&[${sources.casen_health_system.year}]`
              )
          );
          return mondrianClient.query(q);
        })
        .then(res => {
          return {
            key: "datum_health_healthcare_avg",
            data: flattenDeep(res.data.values)
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { children, t, i18n } = this.props;
    const { datum_health_healthcare_avg } = this.context.data;
    const locale = i18n.locale;

    let geo = this.context.data.geo;
    if (geo.type === "comuna") {
      geo = { ...geo.ancestors[0] };
    }

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
              icon="empleo"
              datum={numeral(datum_health_healthcare_avg[0], locale).format(
                "0,0"
              )}
              title={t("Primary Healthcare Average")}
              subtitle={t("in") + " " + geo.name}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(datum_health_healthcare_avg[1], locale).format(
                "0,0"
              )}
              title={t("Specialized Healthcare Average")}
              subtitle={t("in") + " " + geo.name}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(datum_health_healthcare_avg[2], locale).format(
                "0,0"
              )}
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
