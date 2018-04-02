import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";

import { regionsColorScale } from "helpers/colors";
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

class ExportsByRegion extends Section {
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
            .drilldown("Geography", "Geography", "Comuna")
            .drilldown("Date", "Date", "Year")
            .measure("FOB US"),
          "HS0",
          "HS2",
          store.i18n.locale
        );

        return {
          key: "product_exports_by_region",
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
    const path = this.context.data.product_exports_by_region;

    const title = t("Exports By Region");

    const locale = i18n.language;
    const classSvg = "exports-by-region";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Exports By Region")}</span>
          <ExportLink path={path} className={classSvg} title={title} />
        </h3>

        <TreemapStacked
          path={path}
          msrName="FOB US"
          drilldowns={["Region", "Comuna"]}
          className={classSvg}
          config={{
            label: d =>
              d["Country"] instanceof Array ? d["Region"] : d["Comuna"],
            total: d => d["FOB US"],
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "($ 0.[00] a)"
                )
            },
            shapeConfig: {
              fill: d => regionsColorScale("c" + d["ID Region"])
            },
            on: {
              click: d => {
                //if (!(d["ID Comuna"] instanceof Array)) {
                var url = slugifyItem(
                  "geo",
                  d["ID Region"],
                  d["Region"],
                  d["ID Comuna"] instanceof Array ? false : d["ID Comuna"],
                  d["Comuna"] instanceof Array ? false : d["Comuna"]
                );

                router.push(url);
                //}
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
                  "US" + numeral(d["FOB US"], locale).format("(USD 0 a)") + link
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
                  "US" + numeral(d["FOB US"], locale).format("(USD 0 a)") + link
                );
              }
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 25,
                height: 25,
                backgroundImage: d =>
                  "/images/legend/region/" + d["ID Region"] + ".png"
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

export default translate()(ExportsByRegion);
