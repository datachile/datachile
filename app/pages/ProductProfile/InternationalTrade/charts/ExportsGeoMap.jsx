import React from "react";
import { Section } from "datawheel-canon";
import { Geomap } from "d3plus-react";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { geoNaturalEarth1 } from "d3-geo";

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
            .property("Destination Country", "Country", "iso3"),
          "HS0",
          "HS2",
          store.i18n.locale
        );

        q.cut(`[Date].[Year].&[2015]`);

        return {
          key: "product_exports_by_destination",
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
    const path = this.context.data.product_exports_by_destination;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Exports By Destination")}</span>
          <ExportLink path={path} />
        </h3>
        <Geomap
          config={{
            height: 500,
            data: path,
            fitObject: "/geo/countries.json",
            topojson: "/geo/countries.json",
            groupBy: "iso3",
            topojsonId: "id",
            padding: -20,
            tiles: false,
            ocean: "transparent",
            //padding: "100px 0px 90px 0px",
            projection: "geoMercator",
            //tileUrl: "https://cartocdn_{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
            topojsonFilter: d => {
              return ["ATA"].indexOf(d.id) < 0;
            },
            fitFilter: d => {
              return ["ATA"].indexOf(d.id) < 0;
            },
            topojsonKey: "id",
            fitKey: "id",
            label: d => d["Country"],
            //sum: d => d["FOB US"],
            colorScale: "FOB US",
            //time: "ID Year",
            total: d => d["FOB US"],
            zoom: true,
            zoomBrushHandleSize: 3,
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(d.text.split(": ")[1], locale).format("($ 0.00 a)")
            },
            shapeConfig: {
              //fill: d => continentColorScale("c" + d["ID Continent"])
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
            },
            legendConfig: {
              label: d => d["Continent"],
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d =>
                  "/images/legend/continent/" + d["ID Continent"] + ".png"
              }
            }
          }}
          dataFormat={data => {
            console.log(data.data);
            return data.data.map(item => {
              return { ...item, ["FOB US"]: Math.log(item["FOB US"]) };
            });
          }}
        />
      </div>
    );
  }
}

export default translate()(ExportsGeoMap);
