import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { translate } from "react-i18next";

import { sources } from "helpers/consts";
import { administrationColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";
import NoDataAvailable from "components/NoDataAvailable";

class PSUDistribution extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_education_psu_distribution",
      "psu",
      ["Number of records"],
      {
        drillDowns: [
          ["Calculated PSU Bucket", "Calculated PSU Bucket", "Bucket"]
        ],
        cuts: [`[Date].[Date].[Year].&[${sources.psu.year}]`],
        options: { parents: true, sparse: false, nonempty: false }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;
    const { geo, path_education_psu_distribution } = this.context.data;

    const path = path_education_psu_distribution;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("PSU distribution")}</span>
          <ExportLink path={path} />
        </h3>

        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: "ID Bucket",
            label: d => d["Bucket"],
            x: "Bucket",
            y: "Number of records",
            shapeConfig: {
              fill: d => administrationColorScale(),
              label: d => d["Bucket"]
            },
            xConfig: {
              title: false
            },
            xSort: (a, b) => (a["ID Bucket"] > b["ID Bucket"] ? 1 : -1),
            yConfig: {
              title: t("PSU exams")
            },
            tooltipConfig: {
              title: d => d["Bucket"],
              body: d =>
                numeral(d["Number of records"], locale).format("(0.[0] a)") +
                " " +
                t("PSU exams")
            },
            legend: false
          }}
          dataFormat={data => {
            console.log("DATA", data.data);
            return data.data;
          }}
        />

        <SourceNote cube="psu" />
      </div>
    );
  }
}
export default translate()(PSUDistribution);
