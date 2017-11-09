import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

export default translate()(
  class WagesByProgram extends Section {
    static need = [
      (params, store) => {
        const institution = getLevelObject(params);
        const prm = mondrianClient
          .cube("education_employability")
          .then(cube => {
            const q = levelCut(
              institution,
              "Higher Institutions",
              "Higher Institutions",
              cube.query
                .option("parents", true)
                .drilldown(
                  "Avg Income 4th year",
                  "Avg Income 4th year",
                  "Avg Income 4th year"
                )
                .drilldown("Careers", "Careers", "Career")
                .measure("Avg anual payment 2016"),
              "Higher Institution Subgroup",
              "Higher Institution",
              store.i18n.locale,
              false
            );

            return {
              key: "path_institution_wages_by_program",
              data: store.env.CANON_API + q.path("jsonrecords")
            };
          });

        return {
          type: "GET_DATA",
          promise: prm
        };
      }
    ];

    render() {
      const { t, className, i18n } = this.props;
      const path = this.context.data.path_institution_wages_by_program;
      const locale = i18n.language.split("-")[0];

      return (
        <div className={className}>
          <h3 className="chart-title">{t("Wages by Program")}</h3>
          <BarChart
            config={{
              height: 500,
              data: path,
              groupBy: "ID Avg Income 4th year",
              label: d => d["Avg Income 4th year"],
              x: "Career",
              y: "Avg Income 4th year",
              shapeConfig: {
                fill: d => ordinalColorScale(3)
              },
              xConfig: {
                tickSize: 0,
                title: false
              },
              yConfig: {
                title: t("Wages"),
                tickFormat: tick => numeral(tick, locale).format("(0.0 a)")
              },
              barPadding: 20,
              groupPadding: 40,
              tooltipConfig: {
                title: d => d["Career"],
                body: d =>
                  numeral(d["Avg anual payment 2016"], locale).format(
                    "( 0,0 )"
                  ) +
                  " " +
                  t("val")
              },
              legendConfig: {
                label: false,
                shapeConfig: false
              }
            }}
            dataFormat={data => {
              console.warn(data.data);
              return data.data;
            }}
          />
        </div>
      );
    }
  }
);
