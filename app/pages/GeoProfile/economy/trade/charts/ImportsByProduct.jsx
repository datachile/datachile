import React from "react";
import { Section } from "datawheel-canon";
import TreemapStacked from "components/TreemapStacked";
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

class ImportsByProduct extends Section {
  static need = [
    simpleGeoChartNeed("path_imports_by_product", "imports", ["CIF US"], {
      drillDowns: [["Import HS", "HS2"], ["Date", "Year"]],
      options: { parents: true }
    })
  ];

  render() {
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;
    const locale = i18n.language;
    const path = this.context.data.path_imports_by_product;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t(`Imports of firms located in ${geo.name}`)}</span>
          <ExportLink path={path} />
        </h3>
        <TreemapStacked
          path={path}
          msrName="CIF US"
          drilldowns={["HS0", "HS2"]}
          config={{
            height: 500,
            data: path,
            total: d => d["CIF US"],
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "($ 0.[00] a)"
                )
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 25,
                height: 25,
                fill: d => productsColorScale("hs" + d["ID HS0"]),
                backgroundImage: d =>
                  "/images/legend/hs/hs_" + d["ID HS0"] + ".png"
              }
            },
            shapeConfig: {
              fill: d => productsColorScale("hs" + d["ID HS0"])
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
                browserHistory.push(url);
              }
            },
            tooltipConfig: {
              title: d => (d["HS2"] instanceof Array ? d["HS0"] : d["HS2"]),
              body: d =>
                "US" +
                numeral(d["CIF US"], locale).format("$ (0 a)") +
                "<br/><a>" +
                t("tooltip.to_profile") +
                "</a>"
            },
            yConfig: {
              title: t("US$"),
              tickFormat: tick => numeral(tick, locale).format("(0 a)")
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(ImportsByProduct);
