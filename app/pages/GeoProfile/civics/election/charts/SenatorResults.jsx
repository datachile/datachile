import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, {
  simpleDatumNeed,
  simpleGeoChartNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { hexToRGB, civicsColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import { Switch } from "@blueprintjs/core";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

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

  constructor(props) {
    super(props);

    this.state = {
      non_electors: true,
      maxYear: 0
    };

    this.toggleElectors = this.toggleElectors.bind(this);
  }

  toggleElectors() {
    this.setState(prevState => ({
      non_electors: !prevState.non_electors
    }));
  }

  render() {
    const path = this.context.data.path_senator_results;
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;
    const participation = this.context.data.need_presidential_participation;

    let non_electors = null;

    if (geo.depth === 2) {
      const data_election = this.context.data.need_presidential_participation;
      non_electors =
        data_election.data[0].Electors - data_election.data[0].Votes;
    }

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Senator Election")}</span>
          <ExportLink path={path} />
        </h3>

        <Treemap
          config={{
            height: 500,
            data: path,
            filter: this.state.non_electors
              ? ""
              : d => d["ID Candidate"] !== 9999,
            total: d => (geo.type === "comuna" ? d["Votes"] : d["count"]),
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "(0,0)"
                ) +
                " " +
                (geo.type === "comuna" ? t("Votes") : t("Elected Authority"))
            },
            groupBy:
              geo.type === "comuna" || geo.type === "region"
                ? ["ID Coalition", "Candidate"]
                : ["ID Coalition", "ID Partido"],
            label: d =>
              geo.type === "comuna" || geo.type === "region"
                ? d["Candidate"] + (d["ID Elected"] === 1 ? "*" : "")
                : d["Partido"],
            sum: d =>
              geo.type === "comuna" || geo.type === "region"
                ? d["Votes"]
                : d["count"],
            time: "ID Year",
            shapeConfig: {
              fill: d => {
                return d["ID Candidate"] !== 9999
                  ? geo.type === "comuna" || geo.type === "region"
                    ? hexToRGB(
                        civicsColorScale("co" + d["ID Coalition"]),
                        d["ID Elected"] === 1 ? 1 : 0.5
                      )
                    : civicsColorScale("co" + d["ID Coalition"])
                  : "#CCCCCC";
              }
            },
            tooltipConfig: {
              title: d => (geo.type === 2 ? d["Candidate"] : d["Partido"]),
              body: d =>
                "<div>" +
                "<div>" +
                (geo.type === "comuna"
                  ? numeral(d["Votes"], locale).format("0,0")
                  : numeral(d["count"], locale).format("0,0")) +
                " " +
                (geo.type === "comuna" ? t("Votes") : t("Elected Authority")) +
                "</div>" +
                "<div>" +
                (geo.type === "comuna" ||
                (geo.type === "region" && d["Partido"] !== "#null")
                  ? d["Partido"]
                  : "") +
                " " +
                "</div>" +
                "</div>"
            },
            legendTooltip: {
              title: d => (geo.type === "comuna" ? d["Coalition"] : d["Coalition"]),
              body: d =>
                numeral(d["Votes"], locale).format("0,0") + " " + t("Votes")
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 25,
                height: 25
              }
            }
          }}
          dataFormat={data => {
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
                  ["ID Candidate"]: 9999,
                  ["ID Partido"]: 9999,
                  ["ID Year"]: item["ID Year"],
                  Partido: "",
                  Year: item.Year,
                  elected: 0
                });
              });

            return d;
          }}
        />

        {geo.depth === 2 ||
          (geo.depth === 1 &&
            this.state.maxYear > 2013 && (
              <div>
                <Switch
                  onClick={this.toggleElectors}
                  labelElement={<strong>{t("Total Electors")}</strong>}
                  checked={this.state.non_electors}
                />
              </div>
            ))}
        <SourceNote cube="election_results" />
      </div>
    );
  }
}

export default translate()(SenatorResults);
