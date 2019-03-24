import React from "react";
import { Section } from "@datawheel/canon-core";
import { translate } from "react-i18next";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

import { COLORS_GENDER } from "helpers/colors";

import TreemapStacked from "components/TreemapStacked";
import { LinePlot } from "d3plus-react";

class PopulationByAge extends Section {
  render() {
    const { t, className, i18n } = this.props;
    const { geo } = this.context.data;

    const locale = i18n.language;
    const classSvg = "population-by-age";

    const geoType =
      geo.type.substring(0, 1).toUpperCase() + geo.type.substring(1);

    const path = `/api/data?measures=People&drilldowns=Sex,Age&parents=true&${ geoType }=${ geo.key }&captions=${locale}`;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Population by Age")}
            <SourceTooltip cube="immigration" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <LinePlot
          config={{
            data: path,
            groupBy: ["ID Sex"],
            height: 400,
            label: d => d["Sex"],
            xConfig: {
              labelRotation: 0,
              tickFormat: d => (d * 1) % 5 === 0 ? d : "",
              title: t("Age")
            },
            yConfig: {
              title: t("Population")
            },
            shapeConfig: {
              Line: {
                stroke: d => COLORS_GENDER[d["ID Sex"]]
              }
            },
            x: "ID Age",
            y: "People"
          }}
          dataFormat={resp => resp.data}
        />
      </div>
    );
  }
}

export default translate()(PopulationByAge);
