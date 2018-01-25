import React from "react";
import { Section } from "datawheel-canon";
import { StackedArea } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { employmentColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class CrimeStacked extends Section {
  static need = [];

  render() {
    const { t, className, i18n } = this.props;

    const path = this.context.data.path_health_death_causes;
    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Crimes Over Time")}</span>
          <ExportLink path={path} />
        </h3>

        <StackedArea
          config={{
            height: 500,
            data: path,
            groupBy: ["Crime"],
            label: d => d["Crime"],
            y: d => d["Cases"],
            x: d => d["Year"],
            shapeConfig: {
              fill: d => employmentColorScale("CRIME" + d["ID Crime"])
            },
            tooltipConfig: {
              title: d => d["Crime"],
              body: d =>
                numeral(d["Cases"], locale).format("0,0") + " " + t("people")
            },
            xConfig: {
              title: t("Year")
            },
            yConfig: {
              title: t("Number of crimes")
            },
            legend: false
          }}
          dataFormat={data => data.data}
        />
        <SourceNote cube="crimes" />
      </div>
    );
  }
}

export default translate()(CrimeStacked);
