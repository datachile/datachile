import React from "react";
import { Section } from "datawheel-canon";
import { LinePlot } from "d3plus-react";
import { translate } from "react-i18next";

import { ordinalColorScale } from "helpers/colors";

import { numeral } from "helpers/formatters";
import { simpleIndustryChartNeed } from "helpers/MondrianClient";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

class EmployedByCategory extends Section {
  state = {
    lineplot: true
  };

  static need = [
    simpleIndustryChartNeed(
      "path_industry_employed_by_category",
      "nene",
      ["Expansion factor"],
      {
        drillDowns: [["ICSE", "ICSE", "ICSE"], ["Quaterly Reporting"]]
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.path_industry_employed_by_category;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Employment by Category")}</span>
          <ExportLink path={path} />
        </h3>
        {this.state.lineplot ? (
          <LinePlot
            config={{
              height: 500,
              data: path,
              groupBy: "ICSE",
              x: "Month",
              y: "Expansion factor",
              time: "Month",
              timeline: false,
              scale: "time",
              xConfig: {
                tickSize: 0,
                title: false
              },
              yConfig: {
                title: t("Employment by category"),
                tickFormat: tick => numeral(tick, locale).format("0 a")
              },
              shapeConfig: {
                Line: {
                  stroke: d => ordinalColorScale(d["ICSE"]),
                  strokeWidth: 2
                }
              },
              tooltipConfig: {
                title: d => d["ICSE"],
                body: d =>
                  numeral(d["Expansion factor"], locale).format("(0 a)") +
                  " " +
                  t("people")
              },
              legendConfig: {
                shapeConfig: {
                  width: 20,
                  height: 20
                }
              }
            }}
            dataFormat={data => {
              if (data.data && data.data.length > 0) {
                return data.data.filter(item => item.Month !== "2016/12");
              } else {
                this.setState({ lineplot: false });
              }
            }}
          />
        ) : (
          <NoDataAvailable />
        )}
        <SourceNote cube="nene" />
      </div>
    );
  }
}

export default translate()(EmployedByCategory);
