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
        const prm = mondrianClient.cube("education_employability").then(cube => {
          const q = levelCut(
              institution,
              "Higher Institutions",
              cube.query
                  .option("parents", true)
                  .drilldown( "Careers", "Career")
                  .drilldown("Avg Income 4th year", "Avg Income 4th year")
                  .measure("Avg Income 4th year"),
              "Higher Institutions",
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
          <h3 className="chart-title">
            {t("Wages by Program")}
          </h3>
          <BarChart
            config={{
              height: 500,
              data: path,
              groupBy: "Careers",
              label: d =>
                d['Avg Income 4th year'],
              x: "Careers",
              y: "Avg Income 4th year",
              shapeConfig: {
                  fill: d => ordinalColorScale(3)
              },
              xConfig:{
                tickSize:0,
                title:false
              },
              yConfig:{
                title:t("Wages"),
                tickFormat:(tick) => numeral(tick, locale).format("(0.0 a)"),
              },
              barPadding: 20,
              groupPadding: 40,
              tooltipConfig:{
                title: d => d["Careers"],
                body: d => numeral(d['Avg Income 4th year'], locale).format("( 0,0 )") + " " + t("visas")
              },
              legendConfig: {
                  label: false,
                  shapeConfig: false
              }
            }}

          dataFormat={data => { console.log(data.data); return data.data;}}
          />
        </div>
      );
    }
  }
);
