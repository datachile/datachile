import React from "react";

import { Treemap } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { industryOccupationColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import SourceTooltip from "components/SourceTooltip";
import ExportLink from "components/ExportLink";
import TreemapStacked from "components/TreemapStacked";

class IndustryByOccupation extends Section {
  state = {
    show: true
  };

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
    const classSvg = "industry-by-occupation";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Occupations by workers")}
            <SourceTooltip cube="nesi_income" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        <TreemapStacked
          path={path}
          className={classSvg}
          msrName="Expansion Factor"
          drilldowns={["ISCO"]}
          defaultChart={"stacked"}
          config={{
            totalConfig: {
              text: d => d.text + " " + t("people")
            },
            shapeConfig: {
              fill: d => industryOccupationColorScale("isco" + d["ID ISCO"])
            },
            legendConfig: {
              label: false,
              shapeConfig: {
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
        />
      </div>
    );
  }
}

export default translate()(IndustryByOccupation);
