import React from "react";
import { Section } from "datawheel-canon";
import CustomMap from "components/CustomMap";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { continentColorScale } from "helpers/colors";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";

class ExportsGeoMap extends Section {
  static need = [
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient.cube("exports").then(cube => {
        var q = levelCut(
          product,
          "Export HS",
          "HS",
          cube.query
            .option("parents", true)
            .drilldown("Destination Country", "Country", "Country")
            .drilldown("Date", "Date", "Year")
            .measure("FOB US")
            .cut(`[Date].[Year].&[2016]`)
            .property("Destination Country", "Country", "iso3"),
          "HS0",
          "HS2",
          store.i18n.locale
        );

        return {
          key: "product_exports_by_destination_last_year",
          data: __API__ + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];
  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.product_exports_by_destination_last_year;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Exports By Destination")}</span>
          <ExportLink path={path} />
        </h3>
        <CustomMap
          path={path}
          msrName={"FOB US"}
          className={"exports"}
          config={{
            //colorScale: "variable",
            //time: "ID Year",
            total: d => d.variable,
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(d.text.split(": ")[1], locale).format("($ 0.00 a)")
            },
            on: {
              click: d => {
                if (!(d["ID Country"] instanceof Array)) {
                  var url = slugifyItem(
                    "countries",
                    d["ID Continent"],
                    d["Continent"],
                    d["ID Country"] instanceof Array ? false : d["ID Country"],
                    d["Country"] instanceof Array ? false : d["Country"]
                  );
                  browserHistory.push(url);
                }
              }
            },
            tooltipConfig: {
              title: d => {
                return d["Country"] instanceof Array
                  ? d["Continent"]
                  : d["Country"];
              },
              body: d => {
                const link =
                  d["ID Country"] instanceof Array
                    ? ""
                    : "<br/><a>" + t("tooltip.to_profile") + "</a>";
                return numeral(d["FOB US"], locale).format("(USD 0 a)") + link;
              }
            }
          }}
        />
      </div>
    );
  }
}

export default translate()(ExportsGeoMap);
