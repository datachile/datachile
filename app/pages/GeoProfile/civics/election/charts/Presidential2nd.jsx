import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, {
  geoCut,
  simpleGeoChartNeed,
  simpleDatumNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { civicsColorScale } from "helpers/colors";

import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import { Switch } from "@blueprintjs/core";

import groupBy from "lodash/groupBy";

class Presidential2nd extends Section {
  static need = [
    (params, store) =>
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
      )(params, store),
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
    (params, store) =>
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
      )(params, store)
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
    const path = this.context.data.path_electoral_presidential_2nd;
    const { t, className, i18n } = this.props;
    const {
      datum_electoral_presidential_2nd_chile,
      datum_presidential_participation_2nd_round,
      geo
    } = this.context.data;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Results 2nd Round")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Candidate"],
            label: d => d["Candidate"],
            total: d => d["Votes"],
            filter: this.state.non_electors
              ? ""
              : d => d["ID Candidate"] !== 9999,
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
              fill: d => {
                return d["ID Partido"] !== 9999
                  ? civicsColorScale(d["ID Candidate"])
                  : "#CCC";
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
              body: d => "<div></div>"
            },
            legendConfig: {
              shapeConfig: {
                width: 25,
                height: 25
              }
            }
          }}
          dataFormat={data => {
            const total_location_year = data.data.reduce(
              (all, item) => {
                all[item["ID Year"]] += item["Votes"];
                return all;
              },
              { "2013": 0, "2017": 0 }
            );

            const total_location = data.data.reduce((all, item) => {
              return all + item["Votes"];
            }, 0);

            let d = data.data.map(item => {
              return {
                ...item,
                geo: geo.caption,
                percentage: item["Votes"] / total_location_year[item["Year"]]
              };
            });

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

            /*const total_country = datum_electoral_presidential_2nd_chile.data.reduce(
              (all, item) => {
                return all + item["Votes"];
              },
              0
            );

            const total_country_year = datum_electoral_presidential_2nd_chile.data.reduce(
              (all, item) => {
                all[item["ID Year"]] += item["Votes"];
                return all;
              },
              { "2013": 0, "2017": 0 }
            ); 

            const country =
              geo.type !== "country"
                ? datum_electoral_presidential_2nd_chile.data.map(item => {
                    return {
                      ...item,
                      geo: "Chile",
                      percentage:
                        item["Votes"] / total_country_year[item["Year"]]
                    };
                  })
                : [];*/

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

export default translate()(Presidential2nd);
