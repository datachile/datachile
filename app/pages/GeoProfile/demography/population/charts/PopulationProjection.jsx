import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { LinePlot } from "d3plus-react";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class PopulationProjection extends Section {
  static need = [
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

    const locale = i18n.locale;

    const path = this.context.data.path_population_projection;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Population Projection")}</span>
          <ExportLink path={path} />
        </h3>
        <LinePlot
          config={{
            height: 500,
            data: path,
            //groupBy: "Year",
            x: "Year",
            y: "Population",
            xConfig: {
              tickSize: 0,
              title: false
            },
            yConfig: {
              title: t("Population")
              //tickFormat: tick => numeral(tick, locale).format("(0 a)")
            },
            shapeConfig: {
              Line: {
                strokeWidth: 2
              }
            }
          }}
          dataFormat={data => data.data}
        />
        <SourceNote cube="population_estimate" />
      </div>
    );
  }
}

export default translate()(PopulationProjection);
