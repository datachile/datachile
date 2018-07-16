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

import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class ElectoralParticipation extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_electoral_participation",
      "election_participation",
      ["Electors", "Votes", "Participation"],
      {
        drillDowns: [
          ["Election Type", "Election Type", "Election Type"],
          ["Date", "Date", "Year"]
        ],
        options: { parents: true }
      }
    ),
    (params, store) =>
      simpleDatumNeed(
        "datum_electoral_participation_chile",
        "election_participation",
        ["Electors", "Votes", "Participation"],
        {
          drillDowns: [
            ["Election Type", "Election Type", "Election Type"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: true }
        },
        "geo_no_cut",
        false
      )(params, store)
  ];

  render() {
    const path = this.context.data.path_electoral_participation;
    const { t, className, i18n } = this.props;
    const { datum_electoral_participation_chile, geo } = this.context.data;

    const locale = i18n.language;
    const classSvg = "electoral-participation";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Electoral Participation")}</span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <BarChart
          className={classSvg}
          config={{
            height: 500,
            data: path,
            groupBy: ["geo"],
            label: d => d["geo"],
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
            //time: "ID Year",
            x: "Election Type",
            xConfig: {
              title: false
            },
            yConfig: {
              title: t("Participation"),
              tickFormat: tick => numeral(tick, locale).format("0 %")
            },
            xSort: (a, b) =>
              a["ID Year"] > b["ID Year"]
                ? 1
                : b["Election Type"] > a["Election Type"] ? -1 : -1,
            y: "Participation",
            discrete: "x",

            tooltipConfig: {
              body: d =>
                "<div>" +
                "<div>" +
                numeral(d["Electors"], locale).format("0,0") +
                " " +
                t("Electors") +
                "</div>" +
                "<div>" +
                numeral(d["Votes"], locale).format("0,0") +
                " " +
                t("Votes") +
                "</div>" +
                "<div>" +
                numeral(d["Participation"], locale).format("0.0%") +
                " " +
                t("Participation") +
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
            const location = data.data.map(item => {
              return { ...item, geo: geo.caption };
            });

            const country =
              geo.type !== "country"
                ? datum_electoral_participation_chile.data.map(item => {
                    return { ...item, geo: "Chile" };
                  })
                : [];

            return location.concat(country);
          }}
        />
        <SourceNote cube="election_participation" />
      </div>
    );
  }
}

export default translate()(ElectoralParticipation);
