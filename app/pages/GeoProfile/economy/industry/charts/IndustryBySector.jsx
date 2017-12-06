import React, { Component } from "react";

import { Treemap } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";
import { industriesColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import ExportLink from "components/ExportLink";

class IndustryBySector extends Section {
  static need = [
    simpleGeoChartNeed("path_industry_output", "tax_data", ["Output"], {
      drillDowns: [["ISICrev4", "Level 2"], ["Date", "Date", "Year"]],
      options: { parents: true }
    })
  ];

  render() {
    const path = this.context.data.path_industry_output;
    const { t, className, i18n } = this.props;
    const locale = i18n.locale;
    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Industry By Employment")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Level 1", "ID Level 2"],
            label: d =>
              d["Level 2"] instanceof Array ? d["Level 1"] : d["Level 2"],
            sum: d => d["Output"],
            total: d => d["Output"],
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(d.text.split(": ")[1], locale).format("($ 0,0 a)")
            },
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
