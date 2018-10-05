import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { regionsColorScale } from "helpers/colors";
import { getAvailableYears } from "helpers/map";

import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { Switch } from "@blueprintjs/core";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import NoDataAvailable from "components/NoDataAvailable";
import { uuid } from "d3plus-common";

class PresidentialBarchart extends Section {
  static need = [
    simpleDatumNeed(
      "path_civics_presidential_bchart_cl",
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
      "geo_no_cut",
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

  render() {
    const {
      geo,
      path_civics_presidential_tmap,
      path_civics_presidential_bchart_cl,
      path_electoral_presidential_1st
    } = this.context.data;

    const { electionType, year } = this.state;

    const { t, className, i18n } = this.props;

    let data = path_civics_presidential_tmap.data.filter(
      d => d["ID Election Type"] === this.state.electionType
    );

    const _location_total = data.reduce((all, d) => {
      if (!all[d["ID Year"]]) all[d["ID Year"]] = 0;
      all[d["ID Year"]] += d["Votes"];
      return all;
    }, {});

    data = data.map(d => {
      return {
        ...d,
        Geo: geo.caption,
        Percentage: d["Votes"] / _location_total[d["ID Year"]]
      };
    });

    if (geo.type !== "country") {
      const _dataCl = path_civics_presidential_bchart_cl.data.filter(
        d => d["ID Election Type"] === this.state.electionType
      );
      const _country_total = _dataCl.reduce((all, d) => {
        if (!all[d["ID Year"]]) all[d["ID Year"]] = 0;
        all[d["ID Year"]] += d["Votes"];
        return all;
      }, {});

      _dataCl.forEach(d => {
        data.push({
          ...d,
          Geo: "Chile",
          Percentage: d["Votes"] / _country_total[d["ID Year"]]
        });
      });
    }

    const locale = i18n.language;
    const classSvg = "presidential-treemap";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {`${
              electionType === 1
                ? t("Results 1st Round")
                : t("Results 2nd Round")
            } ${year}`}
            <SourceTooltip cube="election_results" />
          </span>
          <ExportLink
            path={path_electoral_presidential_1st}
            className={classSvg}
          />
        </h3>

        <BarChart
          className={classSvg}
          config={{
            height: 400,
            data,
            groupBy: ["Geo"],
            label: d => d["Geo"],
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
            total: d =>
              geo.type !== "country"
                ? d["Geo"] !== "Chile"
                  ? d["Votes"]
                  : 0
                : d["Votes"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "(0,0)"
                ) +
                " " +
                t("Votes")
            },
            shapeConfig: {
              fill: d =>
                geo.type === "country"
                  ? "#86396B"
                  : d["Geo"] == "Chile"
                    ? "#7986CB"
                    : geo.type === "region"
                      ? regionsColorScale(d["geo"])
                      : "#86396B",
              label: d => false
            },
            time: "ID Year",
            y: "Candidate",
            yConfig: {
              title: false
            },
            xConfig: {
              title: "% " + t("Votes"),
              tickFormat: tick => numeral(tick, locale).format("0%")
            },
            x: "Percentage",
            discrete: "y",

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
              body: d => "<div></div>"
            }
          }}
        />

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

export default translate()(PresidentialBarchart);
