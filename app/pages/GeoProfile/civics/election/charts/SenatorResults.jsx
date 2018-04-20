import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleDatumNeed, simpleGeoChartNeed } from "helpers/MondrianClient";
import { coalitionColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import { Switch } from "@blueprintjs/core";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

import maxBy from "lodash/maxBy";

class SenatorResults extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "need_presidential_participation",
        "election_participation",
        ["Electors", "Votes"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: true },
          cuts: ["[Election Type].[Election Type].[Election Type].&[1]"]
        },
        "geo",
        false
      )(params, store),
    (params, store) => {
      if (params.region === "chile")
        return simpleGeoChartNeed(
          "path_senator_results",
          "election_results_update",
          ["Votes"],
          {
            drillDowns: [
              ["Candidates", "Candidates", "Candidate"],
              ["Party", "Party", "Partido"],
              ["Coalition", "Coalition", "Coalition"],
              ["Date", "Date", "Year"]
            ],
            options: { parents: true },
            cuts: [
              "[Election Type].[Election Type].[Election Type].&[3]",
              "[Elected].[Elected].[Elected].&[1]",
              "{[Date].[Date].[Year].&[2013],[Date].[Date].[Year].&[2016],[Date].[Date].[Year].&[2017]}"
            ]
          }
        )(params, store);
      else
        return simpleGeoChartNeed(
          "path_senator_results",
          "election_results_update",
          ["Votes"],
          {
            drillDowns: [
              ["Candidates", "Candidates", "Candidate"],
              ["Party", "Party", "Partido"],
              ["Coalition", "Coalition", "Coalition"],
              ["Date", "Date", "Year"],
              ["Elected", "Elected", "Elected"]
            ],
            options: { parents: true },
            cuts: [
              "[Election Type].[Election Type].[Election Type].&[3]",
              "{[Date].[Date].[Year].&[2013],[Date].[Date].[Year].&[2016],[Date].[Date].[Year].&[2017]}"
            ]
          }
        )(params, store);
    }
  ];

  state = {
    show: true,
    non_electors: true,
    maxYear: 0
  };

  toggleElectors = () => {
    this.setState(prevState => ({
      non_electors: !prevState.non_electors
    }));
  };

  render() {
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;
    const path = this.context.data.path_senator_results;
    const participation = this.context.data.need_presidential_participation;

    const non_electors =
      geo.depth === 2 && participation.data.length > 0
        ? participation.data[0].Electors - participation.data[0].Votes
        : false;

    const locale = i18n.language;
    const classSvg = "senator-election";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Senator Election")}</span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        {this.state.show ? (
          [
            <Treemap
              className={classSvg}
              config={{
                height: 500,
                data: path,
                filter: this.state.non_electors
                  ? ""
                  : d => d["ID Candidate"] !== 9999,
                total: d => (geo.depth > 0 ? d["Votes"] : d["count"]),
                totalConfig: {
                  text: d =>
                    "Total: " +
                    numeral(getNumberFromTotalString(d.text), locale).format(
                      "(0,0)"
                    ) +
                    " " +
                    (geo.depth > 0
                      ? !this.state.non_electors || this.state.maxYear < 2016
                        ? t("Votes")
                        : t("Enabled Voters")
                      : t("Elected Authority"))
                },
                groupBy:
                  geo.depth > 0
                    ? ["ID Coalition", "ID Partido", "ID Candidate"]
                    : ["ID Coalition", "ID Partido"],
                label: d =>
                  geo.depth > 0
                    ? d["Candidate"] + (d["ID Elected"] === 1 ? "*" : "")
                    : d["Partido"],
                sum: d => (geo.depth > 0 ? d["Votes"] : d["count"]),
                time: "ID Year",
                shapeConfig: {
                  fill: d => {
                    const coalition = coalitionColorScale.find(co =>
                      co.keys.includes(d["ID Coalition"])
                    ) || {
                      keys: [],
                      elected: "#ccc",
                      no_elected: "#ccc",
                      base: "#ccc",
                      slug: "sin-asignar"
                    };
                    return d["ID Candidate"] !== 9999
                      ? geo.depth > 0
                        ? d["ID Elected"] === 1
                          ? coalition.elected
                          : coalition.no_elected
                        : coalition.base
                      : "#BDBED6";
                  }
                },
                tooltipConfig: {
                  title: d =>
                    geo.depth > 0
                      ? d["Candidate"]
                      : `<small>${d["Coalition"]}</small><br/>${d["Partido"]}`,
                  body: d =>
                    `<div>
  <p>${
    geo.depth > 0
      ? `${numeral(d.Votes, locale).format("0,0")} ${t("Votes")}`
      : `${numeral(d.count, locale).format("0,0")} ${t("Elected Authority")}`
  }</p>
  <small>${
    geo.depth > 0 && d["Partido"] !== "#null"
      ? ""
      : [].concat(d["Candidate"]).join("<br/>")
  }</small>`
                },
                legendTooltip: {
                  title: d =>
                    d["Coalition"] !== "NAN"
                      ? "<div>" +
                        "<div>" +
                        d["Coalition"] +
                        "</div><div>" +
                        d["Elected"] +
                        "</div>" +
                        "</div>"
                      : "<div>" +
                        t("Blank and Null Votes").toUpperCase() +
                        "</div>",
                  body: d =>
                    "<div>" +
                    (geo.depth > 0
                      ? numeral(d["Votes"], locale).format("0,0")
                      : numeral(d["count"], locale).format("0,0")) +
                    " " +
                    (geo.depth > 0 ? t("Votes") : t("Elected Authority")) +
                    "</div>"
                },
                legendConfig: {
                  label: false,
                  shapeConfig: {
                    width: 25,
                    height: 25,
                    backgroundImage: () =>
                      "/images/legend/civics/civic-icon.png"
                  }
                }
              }}
              dataFormat={data => {
                if (data.data.length > 0) {
                  let d = data.data.map(item => {
                    return { ...item, count: 1, elected: item["ID Elected"] };
                  });

                  this.setState({ maxYear: maxBy(d, "ID Year")["ID Year"] });

                  if (maxBy(d, "ID Year")["ID Year"] > 2013)
                    participation.data.map(item => {
                      d.push({
                        Votes: item.Electors - item.Votes,
                        Candidate: t("Electors that didn't vote").toUpperCase(),
                        Coalition: t("Electors that didn't vote").toUpperCase(),
                        Elected: "",
                        ["ID Candidate"]: 9999,
                        ["ID Partido"]: 9999,
                        ["ID Coalition"]: 9999,
                        ["ID Year"]: item["ID Year"],
                        Partido: "",
                        Year: item.Year,
                        elected: 0
                      });
                    });

                  return d;
                } else {
                  this.setState({ show: false });
                }
              }}
            />,
            (geo.depth === 2 || geo.depth === 1) &&
              this.state.maxYear > 2013 && (
                <div>
                  <Switch
                    onClick={this.toggleElectors}
                    labelElement={<strong>{t("Total Electors")}</strong>}
                    defaultChecked={this.state.non_electors}
                  />
                </div>
              )
          ]
        ) : (
          <NoDataAvailable />
        )}
        <SourceNote cube="election_results" />
      </div>
    );
  }
}

export default translate()(SenatorResults);
