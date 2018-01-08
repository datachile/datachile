import React from "react";

import { Treemap } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { industryOccupationColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import Select from "components/Select";
import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";

class IndustryByOccupation extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_industry_occupation_income",
      "nesi_income",
      ["Expansion Factor", "Median Income"],
      {
        drillDowns: [["ISCO", "ISCO", "ISCO"], ["Date", "Date", "Year"]],
        options: { parents: true }
      }
    )
  ];

  render() {
    const path = this.context.data.path_industry_occupation_income;
    const { t, className, i18n } = this.props;
    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Occupations by workers")}</span>
          <ExportLink path={path} />
        </h3>

        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["ID ISCO"],
            label: d => d["ISCO"],
            sum: d => d["Expansion Factor"],
            total: d => d["Expansion Factor"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "(0.[0] a)"
                ) +
                " " +
                t("people")
            },
            time: "ID Year",
            shapeConfig: {
              fill: d => industryOccupationColorScale("isco" + d["ID ISCO"])
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 20,
                height: 20,
                backgroundImage: d => "/images/legend/occupation/occupation.png"
              }
            },
            tooltipConfig: {
              title: d => d["ISCO"],
              body: d => {
                var body = "<table class='tooltip-table'>";
                body +=
                  "<tr><td class='title'>" +
                  t("People") +
                  "</td><td class='data'>" +
                  numeral(d["Expansion Factor"], locale).format("(0,0)") +
                  "</td></tr>";
                body +=
                  "<tr><td class='title'>" +
                  t("Average Income") +
                  "</td><td class='data'>" +
                  numeral(d["Median Income"], locale).format("$ (0,0)") +
                  "</td></tr>";
                body += "</table>";
                return body;
              }
            }
          }}
          dataFormat={data => data.data}
        />
        <SourceNote cube="nesi_income" />
      </div>
    );
  }
}

export default translate()(IndustryByOccupation);
