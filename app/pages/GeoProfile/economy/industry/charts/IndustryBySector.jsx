import React, { Component } from "react";

import { Treemap } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { industriesColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

class IndustryBySector extends Section {
  static need = [
    simpleGeoChartNeed("path_industry_output", "tax_data", ["Output"], {
      drillDowns: [["ISICrev4", "Level 2"], ["Date", "Date", "Year"]],
      options: { parents: true }
    })
  ];

  render() {
    const path = this.context.data.path_industry_output;
    const { t, className } = this.props;
    return (
      <div className={className}>
        <h3 className="chart-title">{t("Industry By Employment")}</h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Level 1", "ID Level 2"],
            label: d =>
              d["Level 2"] instanceof Array ? d["Level 1"] : d["Level 2"],
            sum: d => d["Output"],
            time: "ID Year",
            shapeConfig: {
              fill: d => industriesColorScale(d["ID Level 1"])
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 25,
                height: 25,
                fill: d => industriesColorScale(d["ID Level 1"]),
                backgroundImage: d =>
                  "https://datausa.io/static/img/attrs/thing_apple.png"
              }
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(IndustryBySector);
