import React from "react";
import { Section } from "datawheel-canon";

import { BarChart } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { ordinalColorScale } from "helpers/colors";
import { getTopCategories } from "helpers/dataUtils";
import { translate } from "react-i18next";

import ExportLink from "components/ExportLink";
import groupBy from "lodash/groupBy";
import flatten from "lodash/flatten";

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

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Performance By School")}</span>
          <ExportLink path={path} />
        </h3>
        <BarChart
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
            colorScale: "Average Score Average (?)",
            colorScalePosition: false,
            colorScaleConfig: {
              color: ["#9eca83", "#35a576", "#299479", "#1b7f7d", "#117180"]
            },
            shapeConfig: {
              //fill: d => ordinalColorScale(2),
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
            }
          }}
          dataFormat={data =>
            getTopCategories(data.data, "Average Score Average (?)")
          }
        />
      </div>
    );
  }
}
export default translate()(PerformanceBySchool);
