import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import {
  numeral,
  slugifyItem,
  getNumberFromTotalString
} from "helpers/formatters";
import { productsColorScale } from "helpers/colors";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import TreemapStacked from "components/TreemapStacked";

class SNEDSchoolByClusters extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_sned_indicators",
      "education_sned",
      ["Number of records"],
      {
        drillDowns: [["Cluster", "Cluster", "Stage 2"], ["Date", "Year"]],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;
    const locale = i18n.language;
    const path = this.context.data.path_sned_indicators;

    const title = t("Number of schools by Cluster");
    const classSvg = "exports-by-product";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{title}</span>
          <ExportLink path={path} className={classSvg} title={title} />
        </h3>
        <TreemapStacked
          path={path}
          className={classSvg}
          msrName="Number of records"
          drilldowns={["Stage 1a", "Stage 1b", "Stage 2"]}
          config={{
            //label: d => (d["HS2"] instanceof Array ? d["HS0"] : d["HS2"]),
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 25,
                height: 25,
                fill: d => productsColorScale("hs" + d["ID Stage 1a"])
              }
            },
            shapeConfig: {
              fill: d => productsColorScale("hs" + d["ID Stage 1a"])
            },
            tooltipConfig: {
              title: d => d["Stage 1a"],
              body: d =>
                "US" +
                numeral(d["Number of records"], locale).format("$ (USD 0 a)") +
                "<br/><a>" +
                t("tooltip.to_profile") +
                "</a>"
            },
            total: d => d["Number of records"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "(0.[00])"
                )
            },
            yConfig: {
              title: t("US$"),
              tickFormat: tick => numeral(tick, locale).format("(0 a)")
            }
          }}
        />
        <SourceNote cube="sned" />
      </div>
    );
  }
}

export default translate()(SNEDSchoolByClusters);
