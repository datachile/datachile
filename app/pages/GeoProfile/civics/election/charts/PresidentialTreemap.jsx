import React from "react";
import { Section } from "@datawheel/canon-core";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { presidentialColorScale } from "helpers/colors";
import { getAvailableYears } from "helpers/map";

import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { Switch } from "@blueprintjs/core";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import NoDataAvailable from "components/NoDataAvailable";
import { uuid } from "d3plus-common";

class PresidentialTreemap extends Section {
  static need = [
    simpleDatumNeed(
      "path_civics_presidential_tmap",
      "election_results_update",
      ["Votes"],
      {
        drillDowns: [
          ["Candidates", "Candidates", "Candidate"],
          ["Date", "Date", "Year"],
          ["Election Type", "Election Type", "Election Type"]
        ],
        options: { parents: true },
        cuts: [
          "{[Election Type].[Election Type].[Election Type].&[1],[Election Type].[Election Type].[Election Type].&[2]}"
        ]
      },
      "geo",
      false
    ),
    simpleDatumNeed(
      "path_civics_participation_tmap",
      "election_participation",
      ["Electors", "Votes"],
      {
        drillDowns: [
          ["Date", "Date", "Year"],
          ["Election Type", "Election Type", "Election Type"]
        ],
        options: { parents: true },
        cuts: [
          "{[Election Type].[Election Type].[Election Type].&[1],[Election Type].[Election Type].[Election Type].&[2]}"
        ]
      },
      "geo",
      false
    )
  ];

  state = {
    electionType: 1,
    show: true,
    non_electors: true,
    year: 2017
  };

  onYearChange(item) {
    this.setState({
      year: item[0] * 1
    });
  }

  toggleChart(item) {
    this.setState({
      electionType: item * 1
    });
  }

  toggleElectors = () => {
    this.setState(prevState => ({
      non_electors: !prevState.non_electors
    }));
  };

  render() {
    const {
      path_civics_presidential_tmap,
      path_civics_participation_tmap,
      path_electoral_presidential_1st
    } = this.context.data;

    const { t, className, i18n } = this.props;

    const data = path_civics_presidential_tmap.data.filter(
      d => d["ID Election Type"] === this.state.electionType
    );

    path_civics_participation_tmap.data.map(d => {
      if (d["ID Election Type"] === this.state.electionType) {
        const text = t("Electors that didn't vote").toUpperCase();
        data.push({
          ...d,
          Candidate: text,
          Coalition: text,
          Partido: "",
          Votes: d.Electors - d.Votes,
          ["ID Candidate"]: 9999,
          ["ID Partido"]: 9999
        });
      }
    });

    const locale = i18n.language;
    const classSvg = "presidential-treemap";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Results 1st Round") + " " + this.state.year}
            <SourceTooltip cube="election_results" />
          </span>
          <ExportLink
            path={path_electoral_presidential_1st}
            className={classSvg}
          />
        </h3>

        {this.state.show ? (
          [
            <Treemap
              key={uuid}
              className={classSvg}
              forceUpdate={true}
              config={{
                height: 400,
                data,
                groupBy: ["ID Candidate"],
                label: d => d["Candidate"],
                filter: this.state.non_electors
                  ? ""
                  : d => d["ID Candidate"] !== 9999,
                timelineConfig: {
                  on: {
                    end: d => {
                      if (d !== undefined) {
                        const time = Array.isArray(d)
                          ? d.map(item => item.getFullYear())
                          : [].concat(d.getFullYear());
                        this.onYearChange(time);
                      }
                      return true;
                    }
                  }
                },
                total: d => d["Votes"],
                totalConfig: {
                  text:
                    this.state.year < 2016
                      ? d => d.text + " " + t("Votes")
                      : d =>
                          d.text +
                          " " +
                          (this.state.non_electors
                            ? t("Enabled Voters")
                            : t("Votes"))
                },
                sum: d => d["Votes"],
                time: "ID Year",
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
            />,
            <Switch
              key={`${uuid}_switch`}
              onClick={this.toggleElectors}
              label={t("Total Electors")}
              defaultChecked={this.state.non_electors}
            />
          ]
        ) : (
          <NoDataAvailable />
        )}

        <div className="btn-group">
          <button
            className={`btn font-xxs ${
              this.state.electionType === 1 ? "is-active" : "is-inactive"
            }`}
            onClick={() => this.toggleChart(1)}
          >
            <span className="btn-text">{t("1st Round")}</span>
          </button>
          <button
            className={`btn font-xxs ${
              this.state.electionType === 2 ? "is-active" : "is-inactive"
            }`}
            onClick={() => this.toggleChart(2)}
          >
            <span className="btn-text">{t("2nd Round")}</span>
          </button>
        </div>
      </div>
    );
  }
}

export default translate()(PresidentialTreemap);
