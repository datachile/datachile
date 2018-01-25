import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { employmentColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class CrimeTreemap extends Section {
  static need = [
    simpleGeoChartNeed("path_crimes_by_crime", "crimes", ["Cases"], {
      drillDowns: [["Crime", "Crime", "Crime"], ["Date", "Date", "Year"]],
      options: { parents: true }
    })
  ];

  render() {
    const { t, className, i18n } = this.props;

    const path = this.context.data.path_crimes_by_crime;
    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Crimes By Crime")}</span>
          <ExportLink path={path} />
        </h3>

        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["Crime"],
            label: d => d["Crime"],
            sum: d => d["Cases"],
            time: "Year",
            shapeConfig: {
              fill: d => employmentColorScale("CRIME" + d["ID Crime"])
            },
            tooltipConfig: {
              title: d => d["Crime"],
              body: d =>
                "<div>" +
                numeral(d["Cases"], locale).format("0,0") +
                " " +
                t("crimes") +
                "<div>"
            },
            total: d => d["Cases"],
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
        <SourceNote cube="crimes" />
      </div>
    );
  }
}

export default translate()(CrimeTreemap);
