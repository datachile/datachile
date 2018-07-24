import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";

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

class ExportsByProduct extends Section {
  static need = [
    simpleGeoChartNeed("path_exports_by_product", "exports", ["FOB US"], {
      drillDowns: [["Export HS", "HS2"], ["Date", "Year"]],
      options: { parents: true }
    })
  ];

  render() {
    const { t, className, i18n, router } = this.props;
    const geo = this.context.data.geo;
    const locale = i18n.language;
    const path = this.context.data.path_exports_by_product;

    const title = t("geo_profile.economy.exports.by_product", geo);
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
          msrName="FOB US"
          drilldowns={["HS0", "HS2"]}
          config={{
            label: d => (d["HS2"] instanceof Array ? d["HS0"] : d["HS2"]),
            legendConfig: {
              label: false,
              shapeConfig: {
                backgroundImage: d =>
                  "/images/legend/hs/hs_" + d["ID HS0"] + ".png",
                fill: d => productsColorScale("hs" + d["ID HS0"])
              }
            },
            shapeConfig: {
              fill: d => productsColorScale("hs" + d["ID HS0"])
            },
            tooltipConfig: {
              title: d => (d["HS2"] instanceof Array ? d["HS0"] : d["HS2"]),
              body: d =>
                "US" +
                numeral(d["FOB US"], locale).format("$ (USD 0 a)") +
                "<br/><a>" +
                t("tooltip.to_profile") +
                "</a>"
            },
            on: {
              click: d => {
                var url = slugifyItem(
                  "products",
                  d["ID HS0"],
                  d["HS0"],
                  d["ID HS2"] instanceof Array ? false : d["ID HS2"],
                  d["HS2"] instanceof Array ? false : d["HS2"]
                );
                router.push(url);
              }
            },
            total: d => d["FOB US"],
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "($ 0.[00] a)"
                )
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

export default translate()(ExportsByProduct);
