import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed, simpleDatumNeed } from "helpers/MondrianClient";
import { presidentialColorScale } from "helpers/colors";
import { getAvailableYears } from "helpers/map";

import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

import { Switch } from "@blueprintjs/core";

class Presidential2nd extends Section {
  static need = [
    simpleDatumNeed(
      "datum_presidential_participation_2nd_round",
      "election_participation",
      ["Electors", "Votes"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: true },
        cuts: ["[Election Type].[Election Type].[Election Type].&[2]"]
      },
      "geo",
      false
    ),
    simpleGeoChartNeed(
      "path_electoral_presidential_2nd",
      "election_results_update",
      ["Votes"],
      {
        drillDowns: [
          ["Candidates", "Candidates", "Candidate"],
          ["Date", "Date", "Year"]
        ],
        options: { parents: true },
        cuts: ["[Election Type].[Election Type].[Election Type].&[2]"]
      }
    ),
    simpleDatumNeed(
      "datum_electoral_presidential_2nd_chile",
      "election_results_update",
      ["Votes"],
      {
        drillDowns: [
          ["Candidates", "Candidates", "Candidate"],
          ["Date", "Date", "Year"]
        ],
        options: { parents: true },
        cuts: ["[Election Type].[Election Type].[Election Type].&[2]"]
      },
      "geo_no_cut",
      false
    )
  ];

  state = {
    show: true,
    non_electors: true,
    year: 2017,
    key: Math.random()
  };

  toggleElectors = () => {
    this.setState(prevState => ({
      non_electors: !prevState.non_electors
      // key: Math.random()
    }));
  };

  onYearChange(item) {
    this.setState({
      year: item[0] * 1
      // key: Math.random()
    });
  }

  render() {
    const path = this.context.data.path_electoral_presidential_2nd;
    const { t, className, i18n } = this.props;
    const {
      datum_presidential_participation_2nd_round,
      geo
    } = this.context.data;

    const locale = i18n.language;
    const classSvg = "presidential-2nd";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Results 2nd Round") + " " + this.state.year}</span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        {this.state.show ? (
          [
            <Treemap
              className={classSvg}
              key={this.state.key}
              config={{
                width:
                  typeof window !== "undefined" &&
                  document.querySelector("." + classSvg)
                    ? document.querySelector("." + classSvg).clientWidth
                    : undefined,
                height: 500,
                data: path,
                groupBy: ["ID Candidate"],
                label: d => d["Candidate"],
                total: d => d["Votes"],
                timeFilter: d => d["ID Year"] === this.state.year,
                filter: this.state.non_electors
                  ? ""
                  : d => d["ID Candidate"] !== 9999,
                totalConfig: {
                  text:
                    this.state.year < 2016
                      ? d =>
                          "Total: " +
                          numeral(
                            getNumberFromTotalString(d.text),
                            locale
                          ).format("(0,0)") +
                          " " +
                          t("Votes")
                      : d =>
                          "Total: " +
                          numeral(
                            getNumberFromTotalString(d.text),
                            locale
                          ).format("(0,0)") +
                          " " +
                          (this.state.non_electors
                            ? t("Enabled Voters")
                            : t("Votes"))
                },
                timelineConfig: {
                  on: {
                    end: d => {
                      if (d !== undefined) {
                        let time = Array.isArray(d)
                          ? d.map(item => item.getFullYear())
                          : [].concat(d.getFullYear());
                        this.onYearChange(time);
                      }
                    }
                  }
                },
                shapeConfig: {
                  fill: d => {
                    const coalition = presidentialColorScale.find(co =>
                      co.keys.includes(d["ID Candidate"])
                    ) || {
                      keys: [],
                      elected: "#B5D9F7",
                      no_elected: "#B5D9F7",
                      base: "#B5D9F7",
                      slug: "sin-asignar"
                    };
                    return d["ID Partido"] !== 9999
                      ? coalition.base
                      : "#BDBED6";
                  }
                },
                //label: d => d["Election Type"] + " - " + d["Year"],
                sum: d => d["Votes"],
                time: "ID Year",

                tooltipConfig: {
                  body: d =>
                    "<div>" +
                    "<div>" +
                    numeral(d["Votes"], locale).format("0,0") +
                    " " +
                    t("Votes") +
                    "</div>" +
                    "</div>"
                },
                legendTooltip: {
                  title: d =>
                    !(d["Candidate"] instanceof Array)
                      ? "<div>" + "<div>" + d["Candidate"] + "</div>"
                      : "<div>" +
                        t("Blank and Null Votes").toUpperCase() +
                        "</div>"
                },
                legend: false
              }}
              dataFormat={data => {
                if (data.data.length > 0) {
                  const total_location_year = data.data.reduce(
                    (all, item) => {
                      all[item["ID Year"]] += item["Votes"];
                      return all;
                    },
                    { "2013": 0, "2017": 0 }
                  );

                  let d = data.data.map(item => {
                    return {
                      ...item,
                      geo: geo.caption,
                      percentage:
                        item["Votes"] / total_location_year[item["Year"]]
                    };
                  });

                  this.setState({ year: getAvailableYears(d).pop() });

                  datum_presidential_participation_2nd_round.data.map(item => {
                    d.push({
                      Votes: item.Electors - item.Votes,
                      Candidate: t("Electors that didn't vote").toUpperCase(),
                      Coalition: t("Electors that didn't vote").toUpperCase(),
                      ["ID Candidate"]: 9999,
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
            <Switch
              onClick={this.toggleElectors}
              labelElement={<strong>{t("Total Electors")}</strong>}
              defaultChecked={this.state.non_electors}
            />
          ]
        ) : (
          <NoDataAvailable />
        )}
        <SourceNote cube="election_results" />
      </div>
    );
  }
}

export default translate()(Presidential2nd);
