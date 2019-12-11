import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import FeaturedDatum from "components/FeaturedDatum";
import { sources } from "helpers/consts";
import { getGeoObject, calculateYearlyGrowth } from "helpers/dataUtils";
import { slugifyItem } from "helpers/formatters";

import mondrianClient, {
  geoCut,
  simpleGeoDatumNeed
} from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

class MigrationSlide extends Section {
  static need = [
    simpleGeoDatumNeed(
      "datum_migration_origin_female",
      "immigration",
      ["Number of visas"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false },
        cuts: [
          `[Date].[Date].[Year].&[${sources.immigration.year}]`,
          `[Sex].[Sex].[Sex].&[1]`
        ]
      }
    ),
    simpleGeoDatumNeed(
      "datum_migration_origin",
      "immigration",
      ["Number of visas"],

      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false },
        cuts: [
          `{[Date].[Date].[Year].&[${sources.immigration.year -
            1}],[Date].[Date].[Year].&[${sources.immigration.year}]}`
        ]
      }
    ),
    (params, store) => {
      const geo = getGeoObject(params);
      const promise = mondrianClient
        .cube("immigration")
        .then(cube => {
          var q = cube.query
            .option("parents", true)
            .drilldown("Origin Country", "Country", "Country")
            .measure("Number of visas")
            .cut(`[Date].[Date].[Year].&[${sources.immigration.year}]`);

          return mondrianClient.query(
            geoCut(geo, "Geography", q, store.i18n.locale),
            "jsonrecords"
          );
        })
        .then(res => {
          return {
            key: "text_data_geo_demography_country",
            data:
              res.data.data && res.data.data.length
                ? res.data.data
                    .sort(
                      (a, b) =>
                        a["Number of visas"] < b["Number of visas"] ? 1 : -1
                    )
                    .slice(0, 2)
                : []
          };
        });

      return { type: "GET_DATA", promise };
    },
    (params, store) => {
      const geo = getGeoObject(params);
      const promise = mondrianClient
        .cube("immigration")
        .then(cube => {
          var q = cube.query
            .option("parents", true)
            .drilldown("Education", "Education", "Education")
            .measure("Number of visas")
            .cut(`[Date].[Date].[Year].&[${sources.immigration.year}]`);

          return mondrianClient.query(
            geoCut(geo, "Geography", q, store.i18n.locale),
            "jsonrecords"
          );
        })
        .then(res => {
          return {
            key: "text_data_geo_demography_education",
            data:
              res.data.data && res.data.data.length
                ? res.data.data.sort(
                    (a, b) =>
                      a["Number of visas"] < b["Number of visas"] ? 1 : -1
                  )[0]
                : false
          };
        });

      return { type: "GET_DATA", promise };
    }
  ];

  render() {
    const { children, t, i18n, immigration_year } = this.props;
    const {
      geo,
      datum_migration_origin,
      datum_migration_origin_female,
      text_data_geo_demography_country,
      text_data_geo_demography_education
    } = this.context.data;

    const c1 =
      text_data_geo_demography_country && text_data_geo_demography_country[0]
        ? text_data_geo_demography_country[0]
        : false;
    const c2 =
      text_data_geo_demography_country && text_data_geo_demography_country[1]
        ? text_data_geo_demography_country[1]
        : false;

    const locale = i18n.language;

    const txt_slide = t("geo_profile.demographics.origin_by_country", {
      last_year: sources.immigration.year,
      visas: numeral(datum_migration_origin[1], locale).format("(0,0)"),
      area: geo.caption,
      visa_first_country_link: c1
        ? slugifyItem(
            "countries",
            c1["ID Continent"],
            c1["Continent"],
            c1["ID Country"],
            c1["Country"]
          )
        : "",
      visa_first_country_name: c1 ? c1["Country"] : "",
      visa_second_country_name: c2 ? c2["Country"] : "",
      visa_second_country_link: c2
        ? slugifyItem(
            "countries",
            c2["ID Continent"],
            c2["Continent"],
            c2["ID Country"],
            c2["Country"]
          )
        : "",
      education_level: text_data_geo_demography_education
        ? text_data_geo_demography_education["Education"]
        : ""
    });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">{t("Migration")}</h3>
          <p
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="visas-inmigrantes"
              datum={numeral(datum_migration_origin[1], locale).format("(0,0)")}
              title={t("Immigrant visas")}
              subtitle={t("granted in") + " " + sources.immigration.year}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="visas-femeninas"
              datum={numeral(
                datum_migration_origin_female / datum_migration_origin[1],
                locale
              ).format("(0.0%)")}
              title={t("Female percent of visas")}
              subtitle={t("granted in") + " " + sources.immigration.year}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="crecimiento-visas"
              datum={numeral(
                calculateYearlyGrowth(datum_migration_origin),
                locale
              ).format("0.0%")}
              title={t("Growth number of visas")}
              subtitle={
                t("In period") +
                " " +
                (sources.immigration.year - 1) +
                "-" +
                sources.immigration.year
              }
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(MigrationSlide);
