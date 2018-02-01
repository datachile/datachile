import React from "react";
import { Section } from "datawheel-canon";
import { StackedArea, BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, {
  geoCut,
  simpleGeoChartNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";

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
    )
  ];

  render() {
    const path = this.context.data.path_electoral_participation;
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Electoral Participation")}</span>
          <ExportLink path={path} />
        </h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: ["Election Type"],
            label: d => d["Election Type"] + " - " + d["Year"],
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
            shapeConfig: {
              fill: d =>
                ordinalColorScale(
                  geo.type === "comuna" ? d["ID Candidate"] : d["ID Party"]
                )
            },
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
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 25,
                height: 25
              }
            }
          }}
          dataFormat={data => data.data}
        />
        <SourceNote cube="election_results" />
      </div>
    );
  }
}

export default translate()(ElectoralParticipation);
