import React from "react";

import { Treemap } from "d3plus-react";
import { browserHistory } from "react-router";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import {
  numeral,
  getNumberFromTotalString,
  slugifyItem
} from "helpers/formatters";
import { industriesColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class IndustryBySector extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_industry_output",
      "tax_data",
      ["Output", "Investment"],
      {
        drillDowns: [["ISICrev4", "Level 2"], ["Date", "Date", "Year"]],
        options: { parents: true }
      }
    )
  ];

  render() {
    const path = this.context.data.path_industry_output;
    const { t, className, i18n } = this.props;
    const locale = i18n.language;
    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Industry By Output (CLP)")}</span>
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
                "Total: " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "($ 0.[0] a)"
                )
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
            },
            on: {
              click: d => {
                var url = slugifyItem(
                  "industries",
                  d["ID Level 1"],
                  d["Level 1"],
                  d["ID Level 2"] instanceof Array ? false : d["ID Level 2"],
                  d["Level 2"] instanceof Array ? false : d["Level 2"]
                );
                browserHistory.push(url);
              }
            },
            tooltipConfig: {
              title: d =>
                d["Level 2"] instanceof Array ? d["Level 1"] : d["Level 2"],
              body: d => {
                var body = "<table class='tooltip-table'>";
                body +=
                  "<tr><td class='title'>" +
                  t("Output") +
                  "</td><td class='data'>" +
                  numeral(d["Output"], locale).format("($ 0,0.[0] a)") +
                  "</td></tr>";
                body +=
                  "<tr><td class='title'>" +
                  t("Investment") +
                  "</td><td class='data'>" +
                  numeral(d["Investment"], locale).format("($ 0,0.[0] a)") +
                  "</td></tr>";
                body += "</table>";
                if (!(d["Level 2"] instanceof Array))
                  body += "<a>" + t("tooltip.to_profile") + "</a>";
                return body;
              }
            }
          }}
          dataFormat={data => data.data}
        />
        <SourceNote cube="tax_data" />
      </div>
    );
  }
}

export default translate()(IndustryBySector);
