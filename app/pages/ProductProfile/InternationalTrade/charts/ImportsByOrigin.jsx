import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";

import { continentColorScale } from "helpers/colors";
import {
  numeral,
  slugifyItem,
  getNumberFromTotalString
} from "helpers/formatters";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import TreemapStacked from "components/TreemapStacked";

class ImportsByDestination extends Section {
  state = {
    treemap: true
  };
  static need = [
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient.cube("imports").then(cube => {
        var q = levelCut(
          product,
          "Import HS",
          "HS",
          cube.query
            .option("parents", true)
            .drilldown("Origin Country", "Country", "Country")
            .drilldown("Date", "Date", "Year")
            .measure("CIF US"),
          "HS0",
          "HS2",
          store.i18n.locale
        );

        return {
          key: "product_imports_by_destination",
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
    const { t, className, i18n, router } = this.props;
    const path = this.context.data.product_imports_by_destination;

    const locale = i18n.language;

    const title = t("Imports By Origin");
    const classSvg = "imports-by-origin";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {title}
            <SourceTooltip cube="imports" />
          </span>
          <ExportLink path={path} className={classSvg} title={title} />
        </h3>

        <TreemapStacked
          path={path}
          msrName="CIF US"
          drilldowns={["Continent", "Country"]}
          className={classSvg}
          config={{
            label: d =>
              d["Country"] instanceof Array ? d["Continent"] : d["Country"],

            total: d => d["CIF US"],
            totalConfig: {
              text: d =>
                "Total: US " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "($0,.[00]a)"
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
                  router.push(url);
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
                  "US " + numeral(d["CIF US"], locale).format("(USD 0a)") + link
                );
              }
            },
            legendConfig: {
              label: d => d["Continent"],
              shapeConfig: {
                backgroundImage: d =>
                  "/images/legend/continent/" + d["ID Continent"] + ".png"
              }
            },
            yConfig: {
              title: t("US$"),
              tickFormat: tick => numeral(tick, locale).format("(0a)")
            }
          }}
        />
      </div>
    );
  }
}

export default translate()(ImportsByDestination);
