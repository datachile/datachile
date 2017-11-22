import React, { Component } from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale, COLORS_GENDER } from "helpers/colors";
import { numeral } from "helpers/formatters";

class SalariesByOccupation extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_salaries_by_occupation",
      "nesi_income",
      ["Median Income"],
      {
        drillDowns: [
          ["ISCO", "ISCO", "ISCO"],
          ["Date", "Date", "Year"],
          ["Sex", "Sex", "Sex"]
        ],
        options: { parents: true }
      }
    )
  ];

  render() {
    const path = this.context.data.path_salaries_by_occupation;
    const { t, className, i18n } = this.props;
    if (!i18n.language) return null;
    const locale = i18n.language.split("-")[0];

    return (
      <div className={className}>
        <h3 className="chart-title">{t("Salaries By Occupation")}</h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Sex"],
            label: d => d["ISCO"],
            time: "ID Year",
            x: "ISCO",
            y: "Median Income",
            shapeConfig: {
              fill: d => COLORS_GENDER[d["ID Sex"]],
              label: d => ""
            },
            xConfig: {
              tickSize: 0,
              title: false
            },
            yConfig: {
              title: t("Median Income CLP"),
              tickFormat: tick => numeral(tick, locale).format("(0.00 a)")
            },
            barPadding: 0,
            groupPadding: 10,
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d =>
                  "/images/legend/sex/" + d["ID Sex"] + ".png"
              }
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(SalariesByOccupation);
