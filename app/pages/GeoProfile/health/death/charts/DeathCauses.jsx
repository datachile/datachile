import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { employmentColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class DeathCauses extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_health_death_causes",
      "death_causes",
      ["Casualities Count SUM", "Casualities rate per 100 inhabitants"],
      {
        drillDowns: [["CIE 10", "CIE 10", "CIE 10"], ["Date", "Date", "Year"]],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;

    const path = this.context.data.path_health_death_causes;
    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Death Causes By Diseases")}</span>
          <ExportLink path={path} />
        </h3>

        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["CIE 10"],
            label: d => d["CIE 10"],
            sum: d => d["Casualities Count SUM"],
            time: "Year",
            shapeConfig: {
              fill: d => employmentColorScale("CIE" + d["ID CIE 10"])
            },
            tooltipConfig: {
              title: d => d["CIE 10"],
              body: d =>
                "<div>" +
                numeral(d["Casualities Count SUM"], locale).format("(0 a)") +
                " " +
                t("people") +
                "</div><div>" +
                numeral(
                  d["Casualities rate per 100 inhabitants"],
                  locale
                ).format("0.0") +
                " " +
                "deaths per 100 inhabitants" +
                "</div>"
            },
            total: d => d["Casualities Count SUM"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "( 0.[00] a)"
                ) +
                " " +
                t("people")
            },
            legend: false
          }}
          dataFormat={data => data.data}
        />
        <SourceNote cube="death_causes" />
      </div>
    );
  }
}

export default translate()(DeathCauses);
