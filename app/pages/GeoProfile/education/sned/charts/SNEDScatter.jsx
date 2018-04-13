import React from "react";
import { Section } from "datawheel-canon";
import { Plot } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { translate } from "react-i18next";

import { sources } from "helpers/consts";
import { snedColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";
import NoDataAvailable from "components/NoDataAvailable";

class SNEDScatter extends Section {
  state = {
    plot: true
  };
  static need = [
    simpleGeoChartNeed(
      "path_sned_efectiveness_vs_overcoming_by_school",
      "education_sned",
      [
        "Avg efectiveness",
        "Avg overcoming",
        "Avg sned_score",
        "Avg initiative",
        "Avg integration",
        "Avg improvement",
        "Avg fairness"
      ],
      {
        drillDowns: [
          ["Institutions", "Institution", "Institution"],
          ["Cluster", "Cluster", "Stage 1a"]
        ],
        cuts: [`[Date].[Date].[Year].&[${sources.sned.year}]`],
        options: { parents: true }
      }
    ),
    simpleGeoChartNeed(
      "path_sned_efectiveness_vs_overcoming_by_school_chile",
      "education_sned",
      [
        "Avg efectiveness",
        "Avg overcoming",
        "Avg sned_score",
        "Avg initiative",
        "Avg integration",
        "Avg improvement",
        "Avg fairness"
      ],
      {
        drillDowns: [
          ["Geography", "Geography", "Comuna"],
          ["Cluster", "Cluster", "Stage 1a"]
        ],
        cuts: [`[Date].[Date].[Year].&[${sources.sned.year}]`],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;
    const {
      geo,
      path_sned_efectiveness_vs_overcoming_by_school,
      path_sned_efectiveness_vs_overcoming_by_school_chile
    } = this.context.data;

    const national = geo.key == "chile" ? true : false;

    const path =
      geo && national
        ? path_sned_efectiveness_vs_overcoming_by_school_chile
        : path_sned_efectiveness_vs_overcoming_by_school;

    const locale = i18n.language;
    const classSvg = "psu-nem-scatter";

    return (
      <div className={className}>
        <div>
          <h3 className="chart-title">
            <span>
              {national
                ? t("Efectiveness vs Overcoming by Comuna & Type")
                : t("Efectiveness vs Overcoming by School")}
            </span>
            <ExportLink path={path} className={classSvg} />
          </h3>
          {this.state.plot ? (
            <Plot
              className={classSvg}
              config={{
                height: 500,
                data: path,
                groupBy: national
                  ? ["ID Comuna", "ID Stage 1a"]
                  : ["ID Institution", "ID Stage 1a"],
                label: d => d["Institution"],
                x: "Avg efectiveness",
                y: "Avg overcoming",
                size: "Avg sned_score",
                colorScalePosition: false,
                shapeConfig: {
                  fill: d => {
                    if (d["Institution"] !== "hack") {
                      return snedColorScale("education" + d["Stage 1a"]);
                    } else {
                      return "transparent";
                    }
                  }
                },
                xConfig: {
                  title: t("Efectiveness")
                },
                x2Config: {
                  barConfig: {
                    "stroke-width": 0
                  }
                },
                yConfig: {
                  title: t("Overcoming")
                },
                tooltip: d => {
                  if (d["Institution"] === "hack") {
                    return "";
                  }
                },
                tooltipConfig: {
                  title: d => {
                    if (d["Institution"] !== "hack") {
                      var title = "";
                      if (d["ID Institution"]) {
                        title =
                          d["ID Institution"] instanceof Array
                            ? d["Stage 1a"]
                            : d["Institution"] + " - " + d["Stage 1a"];
                      }
                      if (d["ID Comuna"]) {
                        title =
                          d["ID Comuna"] instanceof Array
                            ? d["Stage 1a"]
                            : d["Comuna"] +
                              " (" +
                              d["Region"] +
                              ") - " +
                              d["Stage 1a"];
                      }

                      return title;
                    }
                  },
                  body: d => {
                    if (d["Institution"] !== "hack") {
                      var body = "";
                      if (
                        (d["ID Institution"] &&
                          !(d["ID Institution"] instanceof Array)) ||
                        (d["ID Comuna"] && !(d["ID Comuna"] instanceof Array))
                      ) {
                        body = "<table class='tooltip-table'>";
                        body +=
                          "<tr><td class='title'>" +
                          t("Efectiveness") +
                          "</td><td class='data'>" +
                          numeral(d["Avg efectiveness"], locale).format(
                            "(0.[0])"
                          ) +
                          "</td></tr>";
                        body +=
                          "<tr><td class='title'>" +
                          t("Overcoming") +
                          "</td><td class='data'>" +
                          numeral(d["Avg overcoming"], locale).format("(0.0)") +
                          "</td></tr>";
                        body +=
                          "<tr><td class='title'>" +
                          t("Initiative") +
                          "</td><td class='data'>" +
                          numeral(d["Avg initiative"], locale).format("(0.0)") +
                          "</td></tr>";
                        body +=
                          "<tr><td class='title'>" +
                          t("Integration") +
                          "</td><td class='data'>" +
                          numeral(d["Avg integration"], locale).format(
                            "(0.0)"
                          ) +
                          "</td></tr>";
                        body +=
                          "<tr><td class='title'>" +
                          t("Improvement") +
                          "</td><td class='data'>" +
                          numeral(d["Avg improvement"], locale).format(
                            "(0.0)"
                          ) +
                          "</td></tr>";
                        body +=
                          "<tr><td class='title'>" +
                          t("SNED Score") +
                          "</td><td class='data'>" +
                          numeral(d["Avg sned_score"], locale).format("(0.0)") +
                          "</td></tr>";
                        body += "</table>";
                      }
                      return body;
                    }
                  }
                },
                legendTooltip: {
                  title: d => d["Stage 1a"],
                  body: d => ""
                },
                legendConfig: {
                  label: false,
                  shapeConfig: {
                    width: 40,
                    height: 40,
                    backgroundImage: d =>
                      "/images/legend/college/administration.png"
                  }
                }
              }}
              dataFormat={data => {
                const d = data.data.filter(f => {
                  return f["Avg efectiveness"] && f["Avg overcoming"];
                });
                if (d && d.length > 1) {
                  return d;
                } else if (d.length === 1) {
                  d.push({
                    //...d[0],
                    "ID Institution": 999999999,
                    Institution: "hack",
                    "Number of records": 0,
                    "Avg efectiveness": d[0]["Avg efectiveness"] + 8,
                    "Avg overcoming": d[0]["Avg overcoming"] + 8,
                    "Avg sned_score": 1
                  });
                  d.push({
                    //...d[0],
                    "ID Institution": 999999998,
                    Institution: "hack",
                    "Number of records": 0,
                    "Avg efectiveness": d[0]["Avg efectiveness"] - 8,
                    "Avg overcoming": d[0]["Avg overcoming"] - 8,
                    "Avg sned_score": 1
                  });
                  return d;
                } else {
                  this.setState({ plot: false });
                }
              }}
            />
          ) : (
            <NoDataAvailable />
          )}
          <SourceNote cube="sned" />
        </div>
      </div>
    );
  }
}
export default translate()(SNEDScatter);
