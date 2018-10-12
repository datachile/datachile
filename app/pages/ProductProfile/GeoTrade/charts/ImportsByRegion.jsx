import React from "react";
import { Section } from "@datawheel/canon-core";
import { translate } from "react-i18next";

import { regionsColorScale } from "helpers/colors";
import {
  numeral,
  getNumberFromTotalString,
  slugifyItem
} from "helpers/formatters";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import TreemapStacked from "components/TreemapStacked";

class ImportsByRegion extends Section {
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
            .drilldown("Geography", "Geography", "Comuna")
            .drilldown("Date", "Date", "Year")
            .measure("CIF US"),
          "HS0",
          "HS2",
          store.i18n.locale
        );

        return {
          key: "product_imports_by_region",
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
    const path = this.context.data.product_imports_by_region;

    const locale = i18n.language;

    const title = t("Imports By Region");
    const classSvg = "imports-by-region";

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
          drilldowns={["Region", "Comuna"]}
          className={classSvg}
          config={{
            label: d =>
              d["Comuna"] instanceof Array ? d["Region"] : d["Comuna"],

            total: d => d["CIF US"],
            totalConfig: {
              text: d =>
                "Total: US " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "($0,.[00]a)"
                )
            },
            shapeConfig: {
              fill: d => regionsColorScale("c" + d["ID Region"])
            },
            on: {
              click: d => {
                var url = slugifyItem(
                  "geo",
                  d["ID Region"],
                  d["Region"],
                  d["ID Comuna"] instanceof Array ? false : d["ID Comuna"],
                  d["Comuna"] instanceof Array ? false : d["Comuna"]
                );
                router.push(url);
              }
            },
            tooltipConfig: {
              title: d => {
                return d["Comuna"] instanceof Array ? d["Region"] : d["Comuna"];
              },
              body: d => {
                const link =
                  d["ID Comuna"] instanceof Array
                    ? ""
                    : "<br/><a>" + t("tooltip.to_profile") + "</a>";
                return (
                  "US " + numeral(d["CIF US"], locale).format("(USD 0a)") + link
                );
              }
            },
            legendTooltip: {
              title: d => {
                return d["Region"];
              },
              body: d => {
                const link = "<br/><a>" + t("tooltip.to_profile") + "</a>";
                return (
                  "US " + numeral(d["CIF US"], locale).format("(USD 0a)") + link
                );
              }
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                backgroundImage: d =>
                  "/images/legend/region/" + d["ID Region"] + ".png"
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

export default translate()(ImportsByRegion);
