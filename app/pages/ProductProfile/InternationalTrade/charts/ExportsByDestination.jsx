import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { continentColorScale } from "helpers/colors";
import {
  numeral,
  slugifyItem,
  getNumberFromTotalString
} from "helpers/formatters";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import TreemapStacked from "components/TreemapStacked";

class ExportsByDestination extends Section {
  state = {
    treemap: true
  };
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
            .measure("FOB US"),
          "HS0",
          "HS2",
          store.i18n.locale
        );

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

        <TreemapStacked
          path={path}
          msrName="FOB US"
          drilldowns={["Continent", "Country"]}
          config={{
            groupBy: ["ID Continent", "ID Country"],
            label: d =>
              d["Country"] instanceof Array ? d["Continent"] : d["Country"],

            total: d => d["FOB US"],
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "($ 0.[00] a)"
                )
            },
            shapeConfig: {
              fill: d => continentColorScale("c" + d["ID Continent"])
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
                return (
                  "US" + numeral(d["FOB US"], locale).format("$ (0 a)") + link
                );
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
            },
            yConfig: {
              title: t("US$"),
              tickFormat: tick => numeral(tick, locale).format("(0 a)")
            }
          }}
        />

        <SourceNote cube="exports" />
      </div>
    );
  }
}

export default translate()(ExportsByDestination);
