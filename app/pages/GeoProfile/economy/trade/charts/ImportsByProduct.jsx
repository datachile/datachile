import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { numeral, slugifyItem } from "helpers/formatters";
import { productsColorScale } from "helpers/colors";
import { getGeoObject } from "helpers/dataUtils";
import { trade_by_time_and_product } from "helpers/aggregations";

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
    if (!i18n.language) return null;
    const locale = i18n.language.split("-")[0];
    const path = this.context.data.path_imports_by_product;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Imports of firms registered in this location")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["ID HS0", "ID HS2"],
            label: d => (d["HS2"] instanceof Array ? d["HS0"] : d["HS2"]),
            sum: d => d["CIF US"],
            time: "ID Year",
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
                numeral(d["CIF US"], locale).format("(USD 0 a)") +
                "<br/><a>" +
                t("tooltip.to_profile") +
                "</a>"
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(ImportsByProduct);
