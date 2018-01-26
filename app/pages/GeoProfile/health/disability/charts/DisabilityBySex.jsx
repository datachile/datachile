import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { COLORS_GENDER } from "helpers/colors";
import { numeral } from "helpers/formatters";

import { mean } from "d3-array";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class DisabilityBySex extends Section {
  static need = [
    (params, store) => {
      let geo = getGeoObject(params);
      if (geo.type === "comuna") {
        geo = { ...geo.ancestor };
      }
      return simpleGeoChartNeed(
        "path_health_disabilities_by_sex",
        "disabilities",
        ["Expansion Factor Region"],
        {
          drillDowns: [
            ["Sex", "Sex", "Sex"],
            ["Disability Grade", "Disability Grade", "Disability Grade"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: true },
          cuts: [
            "{[Disability Grade].[Disability Grade].[Disability Grade].&[2],[Disability Grade].[Disability Grade].[Disability Grade].&[3]}"
          ]
        }
      )(params, store);
    }
  ];

  render() {
    const path = this.context.data.path_health_disabilities_by_sex;
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;

    (params, store) => {
      let geo = getGeoObject(params);
    };

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Disabilities by Sex")}</span>
          <ExportLink path={path} />
        </h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            aggs: {
              ["ID Sex"]: mean
            },
            groupBy: ["Sex"],
            label: d => t(d["Sex"]),
            y: d => d["Expansion Factor Region"],
            x: d => d["Disability Grade"],
            //discrete: "y",
            stacked: true,
            barPadding: 20,
            groupPadding: 40,
            time: "ID Year",
            shapeConfig: {
              fill: d => COLORS_GENDER[d["ID Sex"]]
            },
            xConfig: {
              tickSize: 0,
              title: false
            },
            yConfig: {
              title: t("Disbilities"),
              tickFormat: tick => numeral(tick, locale).format("(0 a)")
            },
            tooltipConfig: {
              title: d => t(d["Sex"]),
              body: d =>
                numeral(d["Expansion Factor Region"], locale).format(
                  "( 0,0 )"
                ) +
                " " +
                t("disabilities")
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d =>
                  "/images/legend/sex/" + d["ID Sex"] + ".png"
              }
            }
          }}
          dataFormat={data => data.data}
        />
        <SourceNote cube="disabilities" />
      </div>
    );
  }
}

export default translate()(DisabilityBySex);
