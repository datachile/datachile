import React from "react";
import { Section } from "datawheel-canon";
import { StackedArea, BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, {
  geoCut,
  simpleGeoChartNeed,
  simpleDatumNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { regionsColorScale } from "helpers/colors";

import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

import groupBy from "lodash/groupBy";

class Presidential2ndBar extends Section {
  static need = [
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

  render() {
    const path = this.context.data.path_electoral_presidential_2nd;
    const { t, className, i18n } = this.props;
    const { datum_electoral_presidential_2nd_chile, geo } = this.context.data;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Results 2nd Round")}</span>
          <ExportLink path={path} />
        </h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: ["geo"],
            label: d => d["geo"],
            total: d => (d["geo"] !== "Chile" ? d["Votes"] : 0),
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
                return geo.type === "country"
                  ? "#86396B"
                  : d["geo"] == "Chile"
                    ? "#ccc"
                    : geo.type === "region"
                      ? regionsColorScale(d["geo"])
                      : "#86396B";
              },
              label: d => false
            },
            //label: d => d["Election Type"] + " - " + d["Year"],
            //sum: d => d["Votes"],
            time: "ID Year",
            x: "Candidate",
            xConfig: {
              title: false
            },
            yConfig: {
              title: "% " + t("Votes"),
              tickFormat: tick => numeral(tick, locale).format("0 %")
            },
            xSort: (a, b) =>
              a["ID Year"] > b["ID Year"]
                ? 1
                : b["Election Type"] > a["Election Type"] ? -1 : -1,
            y: "percentage",
            discrete: "x",

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

            const location = data.data.map(item => {
              return {
                ...item,
                geo: geo.caption,
                percentage: item["Votes"] / total_location_year[item["Year"]]
              };
            });

            const total_country = datum_electoral_presidential_2nd_chile.data.reduce(
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
                : [];

            return location.concat(country);
          }}
        />
        <SourceNote cube="election_results" />
      </div>
    );
  }
}

export default translate()(Presidential2ndBar);
