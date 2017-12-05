import React, { Component } from "react";

import { Network } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";

class ProductSpace extends Section {
  static need = [
    (params, store) =>
      simpleGeoChartNeed("path_exports_last_year", "exports", ["FOB US"], {
        drillDowns: [["Export HS", "HS4"]],
        options: { parents: true },
        cuts: [`[Date].[Date].[Year].&[${store.exports_year}]`]
      })(params, store)
  ];

  render() {
    const path = this.context.data.path_exports_last_year;
    const { t, className, i18n } = this.props;

    const locale = i18n.locale;
    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Product Space")}</span>
          <ExportLink path={path} />
        </h3>
        <Network
          config={{
            height: 500,
            links: "/json/hs92_4_links_circular_spring_d3p2.json",
            nodes: "/json/hs92_4_nodes_circular_spring_d3p2.json",
            data: path,
            size: "FOB US",
            sizeMin: 1,
            sizeMax: 15,
            zoomScroll: false,
            shapeConfig: {
              Path: {
                stroke: "#555"
              }
            },
            tooltipConfig: {
              title: d => {
                return d["HS2"];
              },
              body: d => numeral(d["FOB US"], locale).format("(USD 0 a)")
            },
            legend: false
          }}
          dataFormat={data => data.data.map(d => ({ id: d["ID HS2"], ...d }))}
        />
      </div>
    );
  }
}

export default translate()(ProductSpace);
