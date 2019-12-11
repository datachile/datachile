import React from "react";
import { Section } from "@datawheel/canon-core";
import { withNamespaces } from "react-i18next";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

import { COLORS_GENDER } from "helpers/colors";

import TreemapStacked from "components/TreemapStacked";
import { LinePlot } from "d3plus-react";

import numeral from "numeral";

class PopulationByAge extends Section {
  render() {
    const { t, className, i18n } = this.props;
    const { geo } = this.context.data;

    const locale = i18n.language;
    const classSvg = "population-by-age";

    const geoType =
      geo.type.substring(0, 1).toUpperCase() + geo.type.substring(1);

    let path = `/api/data?measures=People&drilldowns=Sex,Age&parents=true&captions=${locale}`;
    if (geo.depth > 0) path += `&${geoType}=${geo.key}`;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Population by Age")}
            <SourceTooltip cube="census" />
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
              ticks: [
                5,
                10,
                15,
                20,
                25,
                30,
                35,
                40,
                45,
                50,
                55,
                60,
                65,
                70,
                75,
                80,
                85,
                90,
                95,
                100
              ],
              title: t("Age")
            },
            yConfig: {
              title: t("Population")
            },
            tooltipConfig: {
              tbody: [
                [
                  t("Count"),
                  d => numeral(d["People"]).format("0,0") + " " + t("People")
                ]
              ]
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

export default withNamespaces()(PopulationByAge);
