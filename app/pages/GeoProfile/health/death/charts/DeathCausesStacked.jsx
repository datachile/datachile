import React from "react";
import { Section } from "datawheel-canon";
import { StackedArea } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { employmentColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class DeathCausesStacked extends Section {
  static need = [];

  render() {
    const { t, className, i18n } = this.props;

    const path = this.context.data.path_health_death_causes;
    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Death Causes Over Time")}</span>
          <ExportLink path={path} />
        </h3>

        <StackedArea
          config={{
            height: 500,
            data: path,
            groupBy: ["CIE 10"],
            label: d => d["CIE 10"],
            y: d => d["Casualities Count SUM"],
            x: d => d["Year"],
            shapeConfig: {
              fill: d => employmentColorScale("CIE" + d["ID CIE 10"])
            },
            tooltipConfig: {
              title: d => d["CIE 10"],
              body: d =>
                numeral(d["Casualities Count SUM"], locale).format("(0 a)") +
                " " +
                t("people")
            },
            legend: false
          }}
          dataFormat={data => data.data}
        />
        <SourceNote cube="death_causes" />
      </div>
    );
  }
}

export default translate()(DeathCausesStacked);
