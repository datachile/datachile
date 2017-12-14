import React from "react";
import { Section } from "datawheel-canon";

import { Plot } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { translate } from "react-i18next";

import { institutionsColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

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

    const locale = i18n.locale;

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
            groupBy: ["Administration", "Institution"],
            label: d => d["Administration"],
            x: "Average NEM",
            y: "Average PSU",
            colorScalePosition: false,
            shapeConfig: {
              fill: d => institutionsColorScale(d["ID Administration"])
            },
            xConfig: {
              title: t("Average NEM")
            },
            yConfig: {
              title: t("Average PSU")
            },
            tooltipConfig: {
              title: d => d["Institution"],
              body: d =>
                t("Average NEM: ") +
                numeral(d["Average NEM"], locale).format("(0)") +
                "<br/>" +
                t("Average PSU: ") +
                numeral(d["Average PSU"], locale).format("(0)")
            },
            legendConfig: {
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d =>
                  "/images/legend/college/administration.png"
              }
            }
          }}
          dataFormat={data => {
            return data.data;
          }}
        />
      </div>
    );
  }
}
export default translate()(PSUNEMScatter);
