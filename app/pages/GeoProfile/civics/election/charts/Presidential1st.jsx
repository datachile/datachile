import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed, simpleDatumNeed } from "helpers/MondrianClient";
import { presidentialColorScale } from "helpers/colors";

import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { Switch } from "@blueprintjs/core";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class Presidential1st extends Section {
  static need = [
    (params, store) => {
      return simpleGeoChartNeed(
        "path_electoral_presidential_1nd",
        "election_results_update",
        ["Votes"],
        {
          drillDowns: [
            ["Candidates", "Candidates", "Candidate"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: true },
          cuts: ["[Election Type].[Election Type].[Election Type].&[1]"]
        }
      )(params, store);
    },
    (params, store) =>
      simpleDatumNeed(
        "datum_electoral_presidential_1nd_chile",
        "election_results_update",
        ["Votes"],
        {
          drillDowns: [
            ["Candidates", "Candidates", "Candidate"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: true },
          cuts: ["[Election Type].[Election Type].[Election Type].&[1]"]
        },
        "geo_no_cut",
        false
      )(params, store)
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
    const path = this.context.data.path_electoral_presidential_1nd;
    const { t, className, i18n } = this.props;
    const { need_presidential_participation, geo } = this.context.data;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Results 1st Round")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          key={this.state.key}
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Candidate"],
            label: d => d["Candidate"],
            filter: this.state.non_electors
              ? ""
              : d => d["ID Candidate"] !== 9999,
            total: d => d["Votes"],
            timeFilter: d => d["ID Year"] === this.state.year,
            totalConfig: {
              text:
                this.state.year < 2016
                  ? d =>
                      "Total: " +
                      numeral(getNumberFromTotalString(d.text), locale).format(
                        "(0,0)"
                      ) +
                      " " +
                      t("Votes")
                  : d =>
                      "Total: " +
                      numeral(getNumberFromTotalString(d.text), locale).format(
                        "(0,0)"
                      ) +
                      " " +
                      (this.state.non_electors
                        ? t("Enabled Voters")
                        : t("Votes"))
            },
            sum: d => d["Votes"],
            time: "ID Year",
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
                return d["ID Partido"] !== 9999 ? coalition.base : "#BDBED6";
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
                  : "<div>" + t("Blank and Null Votes").toUpperCase() + "</div>"
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 25,
                height: 25,
                backgroundImage: d => "/images/legend/civics/civic-icon.png"
              }
            }
          }}
          dataFormat={data => {
            let d = data.data;

            need_presidential_participation.data.map(item => {
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
          }}
        />
        <div>
          <Switch
            onClick={this.toggleElectors}
            labelElement={<strong>{t("Total Electors")}</strong>}
            defaultChecked={this.state.non_electors}
          />
        </div>
        <SourceNote cube="election_results" />
      </div>
    );
  }
}

export default translate()(Presidential1st);
