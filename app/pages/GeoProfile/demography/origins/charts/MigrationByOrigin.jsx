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

class MigrationByOrigin extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const promise = mondrianClient.cube("immigration").then(cube => {
        var q = cube.query
          .option("parents", true)
          .drilldown("Date", "Date", "Year")
          .drilldown("Origin Country", "Country", "Country")
          .measure("Number of visas");
        q = geoCut(geo, "Geography", q, store.i18n.locale);

        return {
          key: "path_migration_by_origin",
          data: __API__ + q.path("jsonrecords")
        };
      });

      return { type: "GET_DATA", promise };
    }
  ];

  setCurrentSelection = point => {
    const { onSharedStateChange, sharedKey, sharedValue } = this.props;
    const points = [].concat(point["ID Country"]);
    const drilldown = encodeURIComponent(
      `[Origin Country].[Country].[Country]`
    );

    if (onSharedStateChange)
      onSharedStateChange({
        key: sharedKey,
        value:
          "string" == typeof sharedValue && sharedValue.indexOf(drilldown) > -1
            ? null
            : "&cut%5B%5D=" +
              (points.length == 1
                ? `${drilldown}.%26%5B${points}%5D`
                : `%7B${points.map(p => `${drilldown}.%26%5B${p}%5D`)}%7D`)
      });
  };

  render() {
    const { t, className, i18n, sharedValue } = this.props;
    const locale = i18n.locale;

    let path = this.context.data.path_migration_by_origin;
    if (sharedValue) path = path.replace("&cut", sharedValue + "&cut");

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Migration By Origin")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            on: { click: this.setCurrentSelection },
            height: 500,
            data: path,
            groupBy: ["ID Continent", "ID Country"],
            label: d => {
              d["Country"] = d["Country"] == "Chile" ? ["Chile"] : d["Country"];
              return d["Country"] instanceof Array
                ? d["Continent"]
                : d["Country"];
            },
            sum: d => d["Number of visas"],
            time: "ID Year",
            total: d => d["Number of visas"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(d.text.split(": ")[1], locale).format("0,0") +
                " " +
                t("visas")
            },
            shapeConfig: {
              fill: d => continentColorScale(d["ID Continent"])
            },
            tooltipConfig: {
              title: d => {
                d["Country"] =
                  d["Country"] == "Chile" ? ["Chile"] : d["Country"];
                return d["Country"] instanceof Array
                  ? d["Continent"]
                  : d["Country"];
              },
              body: d =>
                numeral(d["Number of visas"], locale).format("(0 a)") +
                " " +
                t("people")
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
          dataFormat={data => data.data}
        />
        <SourceNote cube="immigration" />
      </div>
    );
  }
}

export default translate()(MigrationByOrigin);
