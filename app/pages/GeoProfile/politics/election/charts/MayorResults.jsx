import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, {
  geoCut,
  simpleGeoChartNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";

import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class MayorResults extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);

      if (geo.type === "comuna") {
        return simpleGeoChartNeed(
          "path_mayor_results",
          "election_results",
          ["Votes"],
          {
            drillDowns: [
              ["Candidates", "Candidates", "Candidate"],
              ["Party", "Party", "Party"],
              ["Date", "Date", "Year"]
            ],
            options: { parents: true },
            cuts: ["[Election Type].[Election Type].[Election Type].&[5]"]
          }
        )(params, store);
      } else {
        return simpleGeoChartNeed(
          "path_mayor_results",
          "election_results",
          ["Number of records", "Votes"],
          {
            drillDowns: [["Party", "Party", "Party"], ["Date", "Date", "Year"]],
            options: { parents: true },
            cuts: [
              "[Election Type].[Election Type].[Election Type].&[5]",
              "[Elected].[Elected].[Elected].&[1]"
            ]
          }
        )(params, store);
      }
    }
  ];

  render() {
    const path = this.context.data.path_mayor_results;
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Mayor Election")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            total: d =>
              geo.type === "comuna" ? d["Votes"] : d["Number of records"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "(0,0)"
                ) +
                " " +
                (geo.type === "comuna" ? t("Votes") : t("Elected Authority"))
            },
            groupBy: geo.type === "comuna" ? ["Candidate"] : ["Party"],
            label: d => (geo.type === "comuna" ? d["Candidate"] : d["Party"]),
            sum: d =>
              geo.type === "comuna" ? d["Votes"] : d["Number of records"],
            time: "ID Year",
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
                (geo.type === "comuna"
                  ? numeral(d["Votes"], locale).format("0,0")
                  : numeral(d["Number of records"], locale).format("0,0")) +
                " " +
                (geo.type === "comuna" ? t("Votes") : t("Elected Authority")) +
                "</div>" +
                "<div>" +
                (geo.type === "comuna" ? d["Party"] : "") +
                " " +
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

export default translate()(MayorResults);
