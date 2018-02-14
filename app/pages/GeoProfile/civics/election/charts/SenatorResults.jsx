import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, {
  simpleDatumNeed,
  simpleGeoChartNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import { Switch } from "@blueprintjs/core";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

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
      let geo = params;
      if (geo.comuna) {
        //geo.comuna = undefined;

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
        )(geo, store);
      } else {
        return simpleGeoChartNeed(
          "path_senator_results",
          "election_results_update",
          ["Number of records", "Votes"],
          {
            drillDowns: [
              ["Candidates", "Candidates", "Candidate"],
              ["Coalition", "Coalition", "Coalition"],
              ["Party", "Party", "Partido"],
              ["Date", "Date", "Year"]
            ],
            options: { parents: true },
            cuts: [
              "[Election Type].[Election Type].[Election Type].&[3]",
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
      non_electors: true
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
    let non_electors = null;

    if (geo.depth === 2) {
      const data_election = this.context.data.need_mayor_participation;
      non_electors =
        data_election.data[0].Electors - data_election.data[0].Votes;
    }

    const locale = i18n.language;

    const pactos = [
      { name: "Chile Vamos", ids: [3, 6, 7] },
      { name: "Nueva Mayoría", ids: [1, 2, 9, 10, 11, 14] },
      { name: "Frente Amplio", ids: [4, 12, 13, 15, 25] }
    ];

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
            total: d =>
              geo.type === "comuna"
                ? d["Votes"]
                : geo.type === "region"
                  ? d["Number of records"] / d["Number of records"]
                  : d["count"],
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
                : ["ID Coalition", "Partido"],
            label: d =>
              geo.type === "comuna" || geo.type === "region"
                ? d["Candidate"] + (d["ID Elected"] === 1 ? "*" : "")
                : d["Partido"],
            sum: d =>
              geo.type === "comuna"
                ? d["Votes"]
                : geo.type === "region"
                  ? d["Number of records"] / d["Number of records"]
                  : d["count"],
            //time: "ID Year",
            shapeConfig: {
              fill: d => ordinalColorScale("co" + d["ID Coalition"])
            },
            tooltipConfig: {
              //title: d => (geo.type === 2 ? d["Candidate"] : d["Partido"]),
              body: d =>
                "<div>" +
                "<div>" +
                (geo.type === "comuna" || geo.type === "region"
                  ? numeral(d["Votes"], locale).format("0,0")
                  : numeral(d["Number of records"], locale).format("0,0")) +
                " " +
                (geo.type === "comuna" || geo.type === "region"
                  ? t("Votes")
                  : t("Elected Authority")) +
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
              title: d => (geo.depth === 2 ? d["Candidate"] : d["Coalition"])
            },
            legendConfig: {
              label: d =>
                geo.type === "comuna" || geo.type === "region"
                  ? d["Coalition"]
                  : d["Coalition"],
              shapeConfig: {
                width: 25,
                height: 25
              }
            }
          }}
          dataFormat={data => {
            const d = data.data.map(item => {
              return { ...item, count: 1 };
            });

            /*d.push({
              Votes: non_electors,
              Candidate: t("Electors that didn't vote"),
              ["ID Candidate"]: 9999,
              ["ID Partido"]: 9999,
              ["ID Year"]: 2016,
              Partido: "",
              Year: "2016"
            });*/
            return d;
          }}
        />

        {geo.depth === 2 && (
          <div>
            <Switch
              onClick={this.toggleElectors}
              labelElement={<strong>{t("Total Electors")}</strong>}
              checked={this.state.non_electors}
            />
          </div>
        )}
        <SourceNote cube="election_results" />
      </div>
    );
  }
}

export default translate()(SenatorResults);
