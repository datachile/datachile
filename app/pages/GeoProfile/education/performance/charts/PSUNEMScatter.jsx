import React from "react";
import { Section } from "datawheel-canon";

import { Plot } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { translate } from "react-i18next";

import ExportLink from "components/ExportLink";

class PSUNEMScatter extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_education_psu_vs_nem_by_school",
      "education_performance_new",
      ["Average PSU", "Average NEM", "Number of records"],
      {
        drillDowns: [["Institution", "Institution", "Institution"]],
        cuts: [`[Year].[Year].[Year].&[2016]`],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.path_education_psu_vs_nem_by_school;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("PSU vs NEM by school")}</span>
          <ExportLink path={path} />
        </h3>
        <Plot
          config={{
            height: 500,
            data: path,
            groupBy: ["Administration"],
            //label: d =>
            //  d["Country"] instanceof Array ? d["Region"] : d["Country"],
            x: "Average NEM",
            y: "Average PSU",
            colorScale: "Administration",
            colorScalePosition: false,
            colorScaleConfig: {
              color: ["#9eca83", "#35a576", "#299479", "#1b7f7d", "#117180"]
            },
            legendConfig: {
              label: false,
              shapeConfig: false
            },
            xConfig: {
              //domain: [1, 7],
              title: t("Average NEM")
            },
            yConfig: {
              width: 0,
              title: t("Average PSU")
            }
          }}
        />
      </div>
    );
  }
}
export default translate()(PSUNEMScatter);
