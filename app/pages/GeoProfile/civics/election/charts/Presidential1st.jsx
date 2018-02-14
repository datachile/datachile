import React from "react";
import { Section } from "datawheel-canon";
import { Treemap, BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, {
  geoCut,
  simpleGeoChartNeed,
  simpleDatumNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";

import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class Presidential1st extends Section {
  static need = [
    (params, store) => {
      console.log(params);
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

  render() {
    const path = this.context.data.path_electoral_presidential_1nd;
    const { t, className, i18n } = this.props;
    const { datum_electoral_presidential_1nd_chile, geo } = this.context.data;

    const locale = i18n.language;

    //console.log(this.context.data);

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Results 1st Round")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["Candidate"],
            label: d => d["Candidate"],

            //label: d => d["Election Type"] + " - " + d["Year"],
            sum: d => d["Votes"],
            time: "ID Year",
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID Candidate"])
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
              body: d => "<div></div>"
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

export default translate()(Presidential1st);
