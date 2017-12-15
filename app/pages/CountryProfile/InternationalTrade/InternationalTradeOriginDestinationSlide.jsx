import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import FeaturedDatum from "components/FeaturedDatum";

import { recentChampionsBy } from "helpers/aggregations";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

class InternationalTradeOriginDestinationSlide extends Section {
  static need = [
    function slideImport(params, store) {
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
              .drilldown("Date", "Year")
              .drilldown("Geography", "Comuna")
              .measure("CIF US"),
            "Subregion",
            "Country",
            store.i18n.locale,
            false
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          const { first, second, third } = recentChampionsBy(
            recent_data,
            "CIF US"
          );
          console.log(first, second, third);

          // if (first["ID Comuna"])
          return {
            key: "slide_country_trade_destination",
            data: {
              // grouping: groupKeyByAdministration(first, second, third),
              grouping: "21",
              first_municipality: "",
              first_region: "",
              second_municipality: "",
              second_region: "",
              third_municipality: "",
              third_region: ""
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

    const { country, slide_country_trade_destination } = this.context.data;

    const txt_slide =
      t("country_profile.intltrade_origin_dest_slide.import", {
        context: slide_country_trade_destination.grouping,
        level: country.caption,
        destination: slide_country_trade_destination
      }) +
      t("country_profile.intltrade_origin_dest_slide.export", {
        context: "3",
        level: country.caption,
        origin: {
          first_municipality: "",
          first_region: "",
          second_municipality: "",
          second_region: "",
          third_municipality: "",
          third_region: ""
        }
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
