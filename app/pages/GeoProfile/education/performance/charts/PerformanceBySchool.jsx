import React from "react";
import { Section } from "datawheel-canon";

import { BarChart } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { institutionsColorScale } from "helpers/colors";
import { getTopCategories } from "helpers/dataUtils";
import { translate } from "react-i18next";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class PerformanceBySchool extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_education_performance_by_school",
      "education_performance",
      ["Average Score Average (?)"],
      {
        drillDowns: [
          ["Institutions", "Institution", "Institution"],
          ["Date", "Date", "Year"]
        ],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.path_education_performance_by_school;

    const classSvg = "performance-by-school";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Top Schools By Performance")}</span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <BarChart
          className={classSvg}
          config={{
            height: 500,
            data: path,
            groupBy: ["Institution"],
            //label: d =>
            //  d["Country"] instanceof Array ? d["Region"] : d["Country"],
            sum: d => d["Average Score Average (?)"],
            time: "ID Year",
            discrete: "y",
            x: "Average Score Average (?)",
            y: "Institution",
            shapeConfig: {
              fill: d => institutionsColorScale(d["ID Administration"]),
              label: d => d["Institution"]
            },
            xDomain: [1, 7],
            barPadding: 5,
            groupPadding: 5,
            legendConfig: {
              label: false,
              shapeConfig: false
            },
            xConfig: {
              //domain: [1, 7],
              title: t("Average Score")
            },
            yConfig: {
              width: 0,
              title: t("School")
            },
            ySort: (a, b) => {
              return a["Average Score Average (?)"] >
                b["Average Score Average (?)"]
                ? 1
                : -1;
            },
            legendConfig: {
              label: d => d["Administration"],
              shapeConfig: {
                backgroundImage: d =>
                  "/images/legend/college/administration.png"
              }
            }
          }}
          dataFormat={data =>
            getTopCategories(data.data, "Average Score Average (?)")
          }
        />
        <SourceNote cube="education_performance" />
      </div>
    );
  }
}
export default translate()(PerformanceBySchool);
