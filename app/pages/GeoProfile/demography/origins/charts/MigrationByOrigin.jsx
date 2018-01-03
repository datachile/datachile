import React from "react";
import { Section } from "datawheel-canon";
import TreemapStacked from "components/TreemapStacked";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { continentColorScale } from "helpers/colors";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import {
  numeral,
  getNumberFromTotalString,
  slugifyItem
} from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";

export default translate()(
  class MigrationByOrigin extends Section {
    static need = [
      (params, store) => {
        const geo = getGeoObject(params);
        const prm = mondrianClient.cube("immigration").then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", true)
              .drilldown("Date", "Date", "Year")
              .drilldown("Origin Country", "Country", "Country")
              .measure("Number of visas"),
            store.i18n.locale
          );
          return {
            key: "path_migration_by_origin",
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
      const path = this.context.data.path_migration_by_origin;

      const locale = i18n.language;

      return (
        <div className={className}>
          <h3 className="chart-title">
            <span>{t("Migration By Origin")}</span>
            <ExportLink path={path} />
          </h3>
          <TreemapStacked
            path={path}
            msrName="Number of visas"
            drilldowns={["Continent", "Country"]}
            config={{
              label: d => {
                d["Country"] =
                  d["Country"] == "Chile" ? ["Chile"] : d["Country"];
                return d["Country"] instanceof Array
                  ? d["Continent"]
                  : d["Country"];
              },
              total: d => d["Number of visas"],
              totalConfig: {
                text: d =>
                  "Total: " +
                  numeral(getNumberFromTotalString(d.text), locale).format(
                    "0,0"
                  ) +
                  " " +
                  t("visas")
              },
              shapeConfig: {
                fill: d => continentColorScale(d["ID Continent"])
              },
              on: {
                click: d => {
                  if (!(d["ID Country"] instanceof Array)) {
                    var url = slugifyItem(
                      "countries",
                      d["ID Continent"],
                      d["Continent"],
                      d["ID Country"] instanceof Array
                        ? false
                        : d["ID Country"],
                      d["Country"] instanceof Array ? false : d["Country"]
                    );
                    browserHistory.push(url);
                  }
                }
              },
              tooltipConfig: {
                title: d => {
                  d["Country"] =
                    d["Country"] == "Chile" ? ["Chile"] : d["Country"];
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
                    numeral(d["Number of visas"], locale).format("(0 a)") +
                    " " +
                    t("people") +
                    link
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
                title: t("Number of visas"),
                tickFormat: tick => numeral(tick, locale).format("0,0")
              }
            }}
          />
          <SourceNote cube="immigration" />
        </div>
      );
    }
  }
);
