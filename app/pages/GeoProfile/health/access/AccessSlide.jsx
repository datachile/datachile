import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";
import {
  calculateYearlyGrowth,
  getTopCategories,
  getGeoObject
} from "helpers/dataUtils";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class AccessSlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const years = sources.casen.available;
      const key = years.length;
      const msrName =
        geo.type === "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";

      return simpleDatumNeed(
        "datum_health_system_isapre",
        "casen_health_system",
        [msrName],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [
            `{[Date].[Date].[Year].&[${
              years[key - 2]
            }],[Date].[Date].[Year].&[${years[key - 1]}]}`,
            `[Health System].[Health System].[Health System Group].&[3]`
          ]
        }
      )(params, store);
    },
    (params, store) => {
      const geo = getGeoObject(params);
      const years = sources.casen.available;
      const key = years.length;
      const msrName =
        geo.type === "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";

      return simpleDatumNeed(
        "datum_health_system_total_affiliates",
        "casen_health_system",
        [msrName],
        {
          drillDowns: [
            ["Health System", "Health System", "Health System Group"]
          ],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${years[key - 1]}]`]
        },
        false
      )(params, store);
    },
    simpleDatumNeed(
      "datum_population_for_health_access",
      "population_estimate",
      ["Population"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false },
        cuts: [`[Date].[Date].[Year].&[${sources.casen_health_system.year}]`]
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const {
      datum_health_system_isapre,
      datum_health_system_total_affiliates,
      datum_population_for_health_access,
      geo
    } = this.context.data;
    const locale = i18n.locale;
    const msrName =
      geo.type === "comuna"
        ? "Expansion Factor Comuna"
        : "Expansion Factor Region";

    const top = getTopCategories(
      datum_health_system_total_affiliates,
      msrName,
      2
    );
    const total = datum_health_system_total_affiliates.reduce((all, item) => {
      return all + item[msrName];
    }, 0);
    const years = sources.casen.available;
    const key = years.length;

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
              icon="health-firstaid"
              datum={numeral(top[0][msrName], locale).format("0,0")}
              title={t("Affiliates in") + " " + top[0]["Health System Group"]}
              subtitle={
                numeral(top[0][msrName] / total, locale).format("0.0 %") +
                " " +
                t("of total")
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="health-firstaid"
              datum={numeral(
                total / datum_population_for_health_access,
                locale
              ).format("0.0 %")}
              title={t("Population with Health Insurance")}
              subtitle={t("In") + " " + sources.casen_health_system.year}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="health-firstaid"
              datum={numeral(
                calculateYearlyGrowth(datum_health_system_isapre),
                locale
              ).format("0.0 %")}
              title={t("Growth affiliates in ISAPRES")}
              subtitle={
                t("In period") + " " + years[key - 2] + "-" + years[key - 1]
              }
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(AccessSlide);
