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

class CongresspersonResults extends Section {
  static need = [
    (params, store) => {
      let geo = params;
      if (geo.comuna || geo.region !== "chile") {
        return simpleGeoChartNeed(
          "path_congressperson_results",
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
              "[Election Type].[Election Type].[Election Type].&[4]",
              "{[Date].[Date].[Year].&[2013],[Date].[Date].[Year].&[2016],[Date].[Date].[Year].&[2017]}"
            ]
          }
        )(geo, store);
      } else {
        return simpleGeoChartNeed(
          "path_congressperson_results",
          "election_results_update",
          ["Number of records", "Votes"],
          {
            drillDowns: [
              ["Candidates", "Candidates", "Candidate"],
              ["Party", "Party", "Partido"],
              ["Coalition", "Coalition", "Coalition"],
              ["Date", "Date", "Year"]
            ],
            options: { parents: true },
            cuts: [
              "[Election Type].[Election Type].[Election Type].&[4]",
              "{[Date].[Date].[Year].&[2013],[Date].[Date].[Year].&[2016],[Date].[Date].[Year].&[2017]}",
              "[Elected].[Elected].[Elected].&[1]"
            ]
          }
        )(params, store);
      }
    }
  ];

  constructor(props) {
    super(props);

    this.state = {
      non_electors: true,
      year: 2017,
      key: Math.random()
    };

    this.toggleElectors = this.toggleElectors.bind(this);
  }

  toggleElectors() {
    this.setState(prevState => ({
      non_electors: !prevState.non_electors,
      key: Math.random()
    }));
  }

  onYearChange(item) {
    this.setState({
      year: item[0],
      key: Math.random()
    });
  }

  render() {
    const path = this.context.data.path_congressperson_results;
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;
    const participation = this.context.data.need_presidential_participation;

    const non_electors =
      geo.depth === 2 && participation.data.length > 0
        ? participation.data[0].Electors - participation.data[0].Votes
        : null;

    const locale = i18n.language;
    const classSvg = "congressperson-election";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Congressperson Election")}</span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        {this.state.show ? (
          [
            <Treemap
              className={classSvg}
              key={this.state.key}
              config={{
                height: 500,
                data: path,
                timeFilter: d => d["ID Year"] === this.state.year,
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
                      ? !this.state.non_electors || this.state.year < 2016
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
                sum: d =>
                  geo.type === "comuna"
                    ? d["Votes"]
                    : geo.type === "region"
                      ? d["Votes"]
                      : d["count"],
                time: "ID Year",
                shapeConfig: {
                  fill: d => {
                    const coalition = coalitionColorScale.find(co =>
                      co.keys.includes(d["ID Coalition"])
                    ) || {
                      keys: [0, 3, 11, 12, 15, 21],
                      elected: "#000",
                      no_elected: "#000",
                      base: "#000",
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
                  body: d => `<div>
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
                    backgroundImage: d => {
                      return "/images/legend/civics/civic-icon.png";
                    },
                    Rect: {
                      fill: d => "#BDBED6"
                    }
                  }
                }
              }}
              dataFormat={data => {
                if (data.data.length > 0) {
                  let d = data.data.map(item => {
                    return { ...item, count: 1 };
                  });
                  if (geo.type !== "country")
                    participation.data.map(item => {
                      d.push({
                        Votes: item.Electors - item.Votes,
                        Candidate: t("Electors that didn't vote").toUpperCase(),
                        Coalition: t("Electors that didn't vote").toUpperCase(),
                        Elected: "",
                        ["ID Candidate"]: 9999,
                        ["ID Coalition"]: 9999,
                        ["ID Partido"]: 9999,
                        ["ID Year"]: item["ID Year"],
                        Partido: "",
                        Year: item.Year
                      });
                    });
                  return d;
                } else {
                  this.setState({ show: false });
                }
              }}
            />,
            geo.depth > 0 && (
              <Switch
                onClick={this.toggleElectors}
                labelElement={<strong>{t("Total Electors")}</strong>}
                defaultChecked={this.state.non_electors}
              />
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

export default translate()(CongresspersonResults);
