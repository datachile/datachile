import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { LinePlot } from "d3plus-react";

import { simpleGeoChartNeed, simpleGeoDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class PopulationProjection extends Section {
  constructor(props) {
    super(props);
    this.state = {
      minValue: 99999999
    };
  }
  static need = [
    simpleGeoDatumNeed(
      "datum_population_projection",
      "population_estimate",
      ["Population"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: true }
      }
    ),
    simpleGeoChartNeed(
      "path_population_projection",
      "population_estimate",
      ["Population"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;

    const locale = i18n.language;

    const population = this.context.data.population;

    const path = this.context.data.path_population_projection;
    const minPopulation = Math.min(
      ...this.context.data.datum_population_projection
    );

    const classSvg = "population-projection";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Population Projection")}
            <SourceTooltip cube="population_estimate" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <LinePlot
          className={classSvg}
          config={{
            width:
              typeof window !== "undefined" &&
              document.querySelector("." + classSvg)
                ? document.querySelector("." + classSvg).clientWidth
                : undefined,
            height: 400,
            data: path,
            x: "Year",
            y: "Population",
            annotations: [
              {
                data: [
                  { x: population.year, y: minPopulation },
                  { x: population.year, y: population.value }
                ],
                shape: "Line",
                stroke: "#ddd",
                strokeDasharray: "10",
                strokeWidth: 2
              }
            ],
            xConfig: {
              tickSize: 0,
              title: false
            },
            yConfig: {
              title: t("Population"),
              tickFormat: tick => numeral(tick, locale).format("0.[0] a")
            },
            tooltipConfig: {
              title: d => d["Year"],
              body: d => numeral(d["Population"], locale).format("0")
            },
            padding: 3,
            shapeConfig: {
              Line: {
                strokeWidth: 2
              }
            }
          }}
          dataFormat={data => {
            return data.data;
          }}
        />
      </div>
    );
  }
}

export default translate()(PopulationProjection);
