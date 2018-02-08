import React from "react";
import { Section } from "datawheel-canon";
import { Plot } from "d3plus-react";
import { simpleGeoChartNeed, simpleDatumNeed } from "helpers/MondrianClient";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { getGeoObject } from "helpers/dataUtils";

import { mean } from "d3-array";

import { sources } from "helpers/consts";
import { regionsColorScale } from "helpers/colors";
import { numeral, slugifyItem } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";
import NoDataAvailable from "components/NoDataAvailable";

import mergeWith from "lodash/mergeWith";

class PSUNEMScatter extends Section {
  state = {
    plot: true,
    log: false
  };
  static need = [
    (params, store) => {
      let mirror = params;
      mirror.comuna = undefined;

      return simpleDatumNeed(
        "need1",
        "population_estimate",
        ["Population"],
        {
          drillDowns: [["Geography", "Geography", "Comuna"]],
          cuts: [`[Date].[Date].[Year].&[2016]`],
          options: { parents: true }
        },
        "geo",
        false
      )(mirror, store);
    },
    (params, store) => {
      let mirror = params;
      mirror.comuna = undefined;

      return simpleDatumNeed(
        "need2",
        "election_participation",
        ["Votes", "Participation", "Electors"],
        {
          drillDowns: [["Geography", "Geography", "Comuna"]],
          cuts: [`[Date].[Date].[Year].&[2016]`],
          options: { parents: true }
        },
        "geo",
        false
      )(mirror, store);
    }
  ];

  toggleChart(bool) {
    this.setState({
      log: bool
    });
  }

  render() {
    const { t, className, i18n } = this.props;
    const { geo, need1, need2 } = this.context.data;
    const path = null;

    const locale = i18n.language;

    const data_one = need1.data.reduce((all, item) => {
      all[item["ID Comuna"]] = item;
      return all;
    }, {});

    const data_two = need2.data.reduce((all, item) => {
      all[item["ID Comuna"]] = item;
      return all;
    }, {});

    const merged = mergeWith(data_one, data_two);

    const data = Object.keys(mergeWith(data_one, data_two))
      .map(item => merged[item])
      .filter(item => item["ID Comuna"] !== 345);

    let customTick = "";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Participation in Municipal Election") + " - 2016"}</span>
          <ExportLink path={path} />
        </h3>
        {this.state.plot ? (
          <Plot
            config={{
              aggs: {
                "ID Region": mean
              },
              height: 500,
              groupBy: ["Comuna"],
              data: data.map(item => {
                return {
                  ...item,
                  PopulationLOG: Math.log10(item.Population)
                };
              }),
              shapeConfig: {
                fill: d => {
                  if (geo.depth === 2) {
                    return geo.key === d["ID Comuna"] ? "#86396B" : "#CCC";
                  } else {
                    return regionsColorScale("c" + d["ID Region"]);
                  }
                }
              },
              on: {
                click: d => {
                  if (!(d["ID Country"] instanceof Array)) {
                    var url = slugifyItem(
                      "geo",
                      d["ID Region"],
                      d["Region"],
                      d["ID Comuna"] > 350 ? false : d["ID Comuna"],
                      d["Comuna"] > 350 ? false : d["Comuna"]
                    );
                    browserHistory.push(url);
                  }
                }
              },
              tooltipConfig: {
                title: d => d["Comuna"],
                body: d => {
                  const link =
                    d["ID Country"] instanceof Array
                      ? ""
                      : "<a>" + t("tooltip.to_profile") + "</a>";
                  return (
                    "<div>" +
                    t("Population") +
                    ": " +
                    numeral(d["Population"], locale).format("0,0") +
                    "</div>" +
                    "<div>" +
                    t("Votes") +
                    ": " +
                    numeral(d["Votes"], locale).format("0,0") +
                    "</div>" +
                    "<div>" +
                    t("Participation") +
                    ": " +
                    numeral(d["Participation"], locale).format("0.0%") +
                    "</div>" +
                    link
                  );
                }
              },
              legendTooltip: {
                title: d => {
                  if (geo.depth === 2) {
                    return d["Comuna"] instanceof Array
                      ? d["Region"]
                      : d["Comuna"];
                  } else {
                    return d["Region"];
                  }
                }
              },
              legendConfig: {
                label: false,
                shapeConfig: {
                  width: 25,
                  height: 25,
                  backgroundImage: d =>
                    "/images/legend/region/" + d["ID Region"] + ".png"
                }
              },
              y: "Participation",
              yConfig: {
                title: t("Participation"),
                tickFormat: tick =>
                  numeral(parseFloat(tick), locale).format("0%")
              },
              x: this.state.log ? "PopulationLOG" : "Population",
              xConfig: {
                title: t("Population"),
                tickFormat: tick => {
                  let value = this.state.log
                    ? Math.pow(10, parseInt(tick))
                    : parseInt(tick);

                  let newTick = numeral(value, locale).format("0a");
                  if (newTick !== customTick) {
                    customTick = newTick;
                    return newTick;
                  } else {
                    return " ";
                  }
                }
              },
              size: "Votes"
            }}
          />
        ) : (
          <NoDataAvailable />
        )}
        <div className="treemap-stacked-options">
          <a
            className={`toggle ${!this.state.log ? "selected" : ""}`}
            onClick={evt => this.toggleChart(false)}
          >
            {t("LINEAR")}
          </a>
          <a
            className={`toggle ${this.state.log ? "selected" : ""}`}
            onClick={evt => this.toggleChart(true)}
          >
            LOG
          </a>
        </div>
        <SourceNote cube="education_performance_new" />
      </div>
    );
  }
}
export default translate()(PSUNEMScatter);
