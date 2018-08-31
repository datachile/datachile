import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import { regionsColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class Presidential1stBar extends Section {
  static need = [];

  render() {
    const path = this.context.data.path_electoral_presidential_1st;
    const { t, className, i18n } = this.props;
    const { datum_electoral_presidential_1nd_chile, geo } = this.context.data;

    const locale = i18n.language;
    const classSvg = "results-1st-round";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Results 1st Round")}
            <SourceTooltip cube="election_results" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <BarChart
          className={classSvg}
          config={{
            height: 400,
            data: path,
            groupBy: ["geo"],
            label: d => d["geo"],
            total: d =>
              geo.type !== "country"
                ? d["geo"] !== "Chile"
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
              fill: d => {
                return geo.type === "country"
                  ? "#86396B"
                  : d["geo"] == "Chile"
                    ? "#7986CB"
                    : geo.type === "region"
                      ? regionsColorScale(d["geo"])
                      : "#86396B";
              },
              label: d => false
            },
            //label: d => d["Election Type"] + " - " + d["Year"],
            //sum: d => d["Votes"],
            time: "ID Year",
            y: "Candidate",
            yConfig: {
              title: false
            },
            xConfig: {
              title: "% " + t("Votes"),
              tickFormat: tick => numeral(tick, locale).format("0%")
            },
            ySort: (a, b) =>
              a["ID Year"] > b["ID Year"]
                ? 1
                : b["Election Type"] > a["Election Type"]
                  ? -1
                  : -1,
            x: "percentage",
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

            const total_country = datum_electoral_presidential_1nd_chile.data.reduce(
              (all, item) => {
                return all + item["Votes"];
              },
              0
            );

            const total_country_year = datum_electoral_presidential_1nd_chile.data.reduce(
              (all, item) => {
                all[item["ID Year"]] += item["Votes"];
                return all;
              },
              { "2013": 0, "2017": 0 }
            );

            const country =
              geo.type !== "country"
                ? datum_electoral_presidential_1nd_chile.data.map(item => {
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
      </div>
    );
  }
}

export default translate()(Presidential1stBar);
