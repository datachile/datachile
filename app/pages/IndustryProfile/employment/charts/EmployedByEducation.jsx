import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { simpleIndustryChartNeed } from "helpers/MondrianClient";
import { ordinalColorScale } from "helpers/colors";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

class EmployedByEducation extends Section {
  state = {
    treemap: true
  };

  static need = [
    simpleIndustryChartNeed(
      "path_industry_employed_by_education",
      "nene_quarter",
      ["Expansion factor"],
      {
        drillDowns: [
          ["Date", "Date", "Moving Quarter"],
          ["ISCED", "ISCED", "ISCED"]
        ],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.path_industry_employed_by_education;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Employment by Education")}</span>
          <ExportLink path={path} />
        </h3>
        {this.state.treemap ? (
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: ["ISCED"],
              label: d => d["ISCED"],
              sum: d => d["Expansion factor"],
              time: "month",
              total: d => d["Expansion factor"],
              totalConfig: {
                text: d =>
                  "Total: " +
                  numeral(getNumberFromTotalString(d.text), locale).format(
                    "(0 a)"
                  )
              },
              shapeConfig: {
                fill: d => ordinalColorScale("ISCED" + d["ID ISCED"])
              },
              tooltipConfig: {
                title: d => {
                  return d["ISCED"];
                },
                body: d => d["quarter"]
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
                return data.data.map(f => {
                  var date = f["ID Moving Quarter"].split("_");
                  f["month"] = date[0] + "-" + date[1] + "-01";
                  f["quarter"] =
                    date[0] +
                    " (" +
                    date[1] +
                    "," +
                    date[2] +
                    "," +
                    date[3] +
                    ")";
                  return f;
                });
              } else {
                this.setState({ treemap: false });
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

export default translate()(EmployedByEducation);
