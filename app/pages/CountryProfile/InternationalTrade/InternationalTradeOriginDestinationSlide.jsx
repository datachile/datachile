import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import FeaturedDatum from "components/FeaturedDatum";

import { onlyMostRecent, championsBy } from "helpers/aggregations";
import { sources } from "helpers/consts";
import { getLevelObject } from "helpers/dataUtils";
import mondrianClient, { levelCut } from "helpers/MondrianClient";

const last_year = sources.exports_and_imports.year;
const groupingKey = (a, b, c) => {
  if (a.Region == b.Region) return b.Region == c.Region ? "3" : "21";
  else return b.Region == c.Region ? "12" : "";
};

class InternationalTradeOriginDestinationSlide extends Section {
  static need = [
    function slideImportDestinations(params, store) {
      const country = getLevelObject(params);

      const prm = mondrianClient
        .cube("imports")
        .then(cube => {
          const q = levelCut(
            country,
            "Origin Country",
            "Country",
            cube.query
              .option("parents", true)
              .drilldown("Geography", "Comuna")
              .cut(`[Date].[Date].[Year].&[${last_year}]`)
              .measure("CIF US"),
            "Subregion",
            "Country",
            store.i18n.locale,
            false
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          const { first, second, third } = championsBy(res.data.data, "CIF US");

          return {
            key: "slide_country_trade_destination",
            data: {
              grouping: groupingKey(first, second, third),
              first_municipality: first.Comuna,
              first_region: first.Region,
              second_municipality: second.Comuna,
              second_region: second.Region,
              third_municipality: third.Comuna,
              third_region: third.Region
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    function slideExportOrigins(params, store) {
      const country = getLevelObject(params);

      const prm = mondrianClient
        .cube("exports")
        .then(cube => {
          const q = levelCut(
            country,
            "Destination Country",
            "Country",
            cube.query
              .option("parents", true)
              .drilldown("Geography", "Comuna")
              .cut(`[Date].[Date].[Year].&[${last_year}]`)
              .measure("FOB US"),
            "Subregion",
            "Country",
            store.i18n.locale,
            false
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          const { first, second, third } = championsBy(res.data.data, "FOB US");

          return {
            key: "slide_country_trade_origin",
            data: {
              grouping: groupingKey(first, second, third),
              first_municipality: first.Comuna,
              first_region: first.Region,
              second_municipality: second.Comuna,
              second_region: second.Region,
              third_municipality: third.Comuna,
              third_region: third.Region
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { children, t } = this.props;

    const {
      country,
      slide_country_trade_destination,
      slide_country_trade_origin
    } = this.context.data;

    const txt_slide =
      t("country_profile.intltrade_origin_dest_slide.import", {
        context: slide_country_trade_destination.grouping,
        level: country.caption,
        destination: slide_country_trade_destination
      }) +
      t("country_profile.intltrade_origin_dest_slide.export", {
        context: slide_country_trade_origin.grouping,
        level: country.caption,
        origin: slide_country_trade_origin
      });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Origin & Destination")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />

          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={"x"}
              title={t("Trade volume")}
              subtitle="XXXX - YYYY"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={"x"}
              title={t("Trade volume")}
              subtitle="XXXX - YYYY"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={"x"}
              title={t("Trade volume")}
              subtitle="XXXX - YYYY"
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternationalTradeOriginDestinationSlide);
