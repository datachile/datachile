import React, { Component } from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

class SalariesByCategory extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_salaries_by_category",
      "nesi_income",
      ["Median Income"],
      {
        drillDowns: [["ICSE", "ICSE", "ICSE"], ["Date", "Date", "Year"]],
        options: { parents: true }
      }
    )
  ];

  render() {
    const path = this.context.data.path_salaries_by_category;
    const { t, className, i18n } = this.props;
    if (!i18n.language) return null;
    const locale = i18n.language.split("-")[0];

    return (
      <div className={className}>
        <h3 className="chart-title">{t("Salaries By Category")}</h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: "ID ICSE",
            label: d => d["ICSE"],
            time: "ID Year",
            x: "Median Income",
            y: "ICSE",
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID ICSE"])
            },
            discrete: "y",
            xConfig: {
              tickSize: 0,
              title: t("Monthly Median Income CLP"),
              tickFormat: tick => numeral(tick, locale).format("(0.00 a)")
            },
            ySort: (a, b) => {
              return a["Median Income"] > b["Median Income"] ? 1 : -1;
            },
            yConfig: {
              barConfig: { "stroke-width": 0 },
              tickSize: 0,
              ticks: [],
              title: t("Occupational Category")
            },
            barPadding: 0,
            groupPadding: 5,
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 1,
                height: 1
              }
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(SalariesByCategory);
