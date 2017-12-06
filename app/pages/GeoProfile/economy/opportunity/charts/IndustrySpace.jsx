import React, { Component } from "react";

import { Network } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import ExportLink from "components/ExportLink";

class IndustrySpace extends Section {
  static need = [
    (params, store) =>
      simpleGeoChartNeed("path_industry_space", "tax_data", ["Output"], {
        drillDowns: [["ISICrev4", "ISICrev4", "Level 4"]],
        options: { parents: true },
        cuts: [`[Date].[Date].[Year].&[${store.tax_data_year}]`]
      })(params, store)
  ];

  render() {
    const path = this.context.data.path_industry_space;
    const { t, className, i18n } = this.props;

    const locale = i18n.locale;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Industry Space")}</span>
          <ExportLink path={path} />
        </h3>
        <Network
          config={{
            height: 500,
            links: "/json/isic_4_02_links_d3p2.json",
            nodes: "/json/isic_4_02_nodes_d3p2.json",
            data: path,
            size: "Output",
            sizeMin: 1,
            sizeMax: 15,
            zoomScroll: false,
            shapeConfig: {
              Path: {
                stroke: "#555"
              }
            },
            legend: false,
            tooltipConfig: {
              title: d => {
                return d["Level 4"];
              },
              body: d => numeral(d["Output"], locale).format("(USD 0 a)")
            },
            legend: false
          }}
          dataFormat={data =>
            data.data.map(d => ({
              id: d["ID Level 4"],
              ...d
            }))
          }
        />
      </div>
    );
  }
}

export default translate()(IndustrySpace);
