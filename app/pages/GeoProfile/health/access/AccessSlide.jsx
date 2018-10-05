import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";
import { annualized_growth } from "helpers/calculator";
import { getGeoObject, getTopCategories } from "helpers/dataUtils";

import {
  simpleAvailableGeoDatumNeed,
  getGeoMembersDimension
} from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";
import FONASATooltip from "components/FONASATooltip";

class AccessSlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type === "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";
      return getGeoMembersDimension(
        "members_casen_health_system",
        "casen_health_system",
        [msrName],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false }
        }
      )(params, store);
    },
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type === "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";

      return simpleAvailableGeoDatumNeed(
        "datum_health_system_isapre",
        "casen_health_system",
        [msrName],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [`[Health System].[Health System].[Health System Group].&[3]`]
        }
      )(params, store);
    },
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type === "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";

      return simpleAvailableGeoDatumNeed(
        "datum_health_system_total_affiliates",
        "casen_health_system",
        [msrName],
        {
          drillDowns: [
            ["Health System", "Health System", "Health System Group"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: false }
        },
        false
      )(params, store);
    },
    simpleAvailableGeoDatumNeed(
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
      members_casen_health_system,
      geo
    } = this.context.data;

    const locale = i18n.language;
    const msrName =
      geo.type === "comuna"
        ? "Expansion Factor Comuna"
        : "Expansion Factor Region";

    let text_access = {},
      total = 0,
      top = [];

    if (
      typeof members_casen_health_system !== "undefined" &&
      members_casen_health_system.length > 0
    ) {
      const membersTotal = members_casen_health_system.length;

      top = getTopCategories(
        datum_health_system_total_affiliates.data.filter(
          item => item.Year === members_casen_health_system[membersTotal - 1]
        ),
        msrName,
        2
      );

      total = datum_health_system_total_affiliates.data
        .filter(
          item => item.Year === members_casen_health_system[membersTotal - 1]
        )
        .reduce((all, item) => {
          return all + item[msrName];
        }, 0);

      const growth_isapre_affiliates = annualized_growth(
        datum_health_system_isapre.data
      );

      text_access = {
        geo,
        year: {
          first: members_casen_health_system[0],
          last: members_casen_health_system[membersTotal - 1]
        },
        share:
          top.length > 0
            ? numeral(
                total / datum_population_for_health_access.data,
                locale
              ).format("0.0%")
            : "",
        insurance: {
          total: numeral(total, locale).format("0,0"),
          isapre: {
            increased_or_decreased:
              growth_isapre_affiliates > 0 ? t("increased") : t("decreased"),
            rate: numeral(growth_isapre_affiliates, locale).format("0.0%")
          },
          share:
            top.length > 0
              ? numeral(top[0][msrName] / total, locale).format("0.0%")
              : ""
        }
      };
    }

    return (
      <div className="topic-slide-block">
        {typeof members_casen_health_system !== "undefined" &&
        members_casen_health_system.length > 0 ? (
          <div className="topic-slide-intro">
            <h3 className="topic-slide-title">{t("Access to Health Insurance")}</h3>
            <div className="topic-slide-text">
              <p
                dangerouslySetInnerHTML={{
                  __html: t("geo_profile.health.access", text_access)
                }}
              />
            </div>
            <div className="topic-slide-data">
              <FeaturedDatum
                className="l-1-3"
                icon="afiliados-fonasa"
                datum={numeral(top[0][msrName], locale).format("0,0")}
                title={t("Affiliates in") + " " + top[0]["Health System Group"]}
                subtitle={
                  numeral(top[0][msrName] / total, locale).format("0.0%") +
                  " " +
                  t("of total")
                }
              />
              <FeaturedDatum
                className="l-1-3"
                icon="poblacion-prevision-salud"
                datum={text_access.share}
                title={t("Population with Health Insurance")}
                subtitle={t("In") + " " + text_access.year.last}
              />
              <FeaturedDatum
                className="l-1-3"
                icon="crecimiento-afiliados-isapre"
                datum={text_access.insurance.isapre.rate}
                title={t("Growth affiliates in ISAPRES")}
                subtitle={
                  t("In period") +
                  " " +
                  text_access.year.first +
                  "-" +
                  text_access.year.last
                }
              />
            </div>
            <h4 className="topic-slide-context-subhead">
              {t("About the FONASA groups")}
              <FONASATooltip />
            </h4>
          </div>
        ) : (
          <div />
        )}
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(AccessSlide);
