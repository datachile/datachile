import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import { getGeoObject, calculateYearlyGrowth } from "helpers/dataUtils";

import mondrianClient, {
  geoCut,
  simpleGeoDatumNeed
} from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";

class MigrationActivitySlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const promise = mondrianClient
        .cube("immigration")
        .then(cube => {
          var q = cube.query
            .option("parents", true)
            .drilldown("Activity", "Activity", "Activity")
            .measure("Number of visas")
            .cut(`[Date].[Date].[Year].&[${sources.immigration.year}]`);

          return mondrianClient.query(
            geoCut(geo, "Geography", q, store.i18n.locale),
            "jsonrecords"
          );
        })
        .then(res => {
          return {
            key: "text_data_geo_demography_activity",
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
    },
    (params, store) => {
      const geo = getGeoObject(params);
      const promise = mondrianClient
        .cube("immigration")
        .then(cube => {
          var q = cube.query
            .option("parents", true)
            .drilldown("Visa Type", "Visa Type", "Visa Type")
            .measure("Number of visas")
            .cut(`[Date].[Date].[Year].&[${sources.immigration.year}]`);

          return mondrianClient.query(
            geoCut(geo, "Geography", q, store.i18n.locale),
            "jsonrecords"
          );
        })
        .then(res => {
          return {
            key: "text_data_geo_demography_type",
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
    const { children, t, i18n } = this.props;

    const locale = i18n.language;

    const {
      geo,
      datum_migration_origin,
      text_data_geo_demography_activity,
      text_data_geo_demography_type
    } = this.context.data;

    const data_slide = {
      last_year: sources.immigration.year,
      area: geo.caption,
      visas: datum_migration_origin
        ? numeral(datum_migration_origin[1], locale).format("(0,0)")
        : "",
      number_activity: text_data_geo_demography_activity
        ? numeral(
            text_data_geo_demography_activity["Number of visas"],
            locale
          ).format("(0,0)")
        : "",
      percentage_activity:
        text_data_geo_demography_activity && datum_migration_origin
          ? numeral(
              text_data_geo_demography_activity["Number of visas"] /
                datum_migration_origin[1],
              locale
            ).format("(0.0 %)")
          : "",
      activity: text_data_geo_demography_activity
        ? text_data_geo_demography_activity["Activity"]
        : "",
      number_type: text_data_geo_demography_type
        ? numeral(
            text_data_geo_demography_type["Number of visas"],
            locale
          ).format("(0,0)")
        : "",
      percentage_type:
        text_data_geo_demography_type && datum_migration_origin
          ? numeral(
              text_data_geo_demography_type["Number of visas"] /
                datum_migration_origin[1],
              locale
            ).format("(0.0 %)")
          : "",
      type: text_data_geo_demography_type
        ? text_data_geo_demography_type["Visa Type"]
        : ""
    };

    const txt_slide = t(
      "geo_profile.demography.origin_by_activity",
      data_slide
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Migration")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-2"
              icon="empleo"
              datum={data_slide.activity}
              title={t("Most common visa activity")}
              subtitle={
                data_slide.number_activity +
                " visas " +
                t("in ") +
                sources.immigration.year
              }
            />
            <FeaturedDatum
              className="l-1-2"
              icon="empleo"
              datum={data_slide.type}
              title={t("Most common visa type")}
              subtitle={
                data_slide.number_type +
                " visas " +
                t("in ") +
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

export default translate()(MigrationActivitySlide);
