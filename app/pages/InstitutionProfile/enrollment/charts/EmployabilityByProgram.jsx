import React from "react";
import _ from "lodash";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

export default translate()(
  class EmployabilityByProgram extends Section {
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
                .drilldown("Careers", "Careers", "Career")
                .measure("Avg employability 1st year")
                .measure("Number of records"),
              "Higher Institution Subgroup",
              "Higher Institution",
              store.i18n.locale,
              false
            );

            return {
              key: "path_institution_employability_by_program",
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
      const path = this.context.data.path_institution_employability_by_program;
      if (!i18n.language) return null;
      const locale = i18n.language.split("-")[0];

      return (
        <div className={className}>
          <h3 className="chart-title">{t("Employability by Program")}</h3>
          <BarChart
            config={{
              height: 500,
              data: path,
              groupBy: "ID Career",
              label: d => d["Avg employability 1st year"],
              x: "Career",
              y: "Avg employability 1st year",
              shapeConfig: {
                fill: d => ordinalColorScale(3)
              },
              xConfig: {
                tickSize: 0,
                title: false
              },
              yConfig: {
                title: t("Employability"),
                tickFormat: tick => numeral(tick, locale).format("(0.0 a)")
              },
              xSort: (a, b) => {
                return a["Avg employability 1st year"] >
                  b["Avg employability 1st year"]
                  ? -1
                  : 1;
              },
              barPadding: 20,
              groupPadding: 40,
              tooltipConfig: {
                title: d => d["Career"],
                body: d =>
                  numeral(d["Number of records"], locale).format("( 0,0 )") +
                  " " +
                  t("val")
              },
              legendConfig: {
                label: false,
                shapeConfig: false
              }
            }}
            dataFormat={function(data) {
              var filtered = _.filter(
                data.data,
                o =>
                  o["Avg employability 1st year"] != null &&
                  o["Avg employability 1st year"] > 0 &&
                  o["Number of records"] != null &&
                  o["Number of records"] > 0
              );
              console.log(filtered);
              return _.orderBy(
                filtered,
                ["Avg employability 1st year"],
                ["desc"]
              );
            }}
          />
        </div>
      );
    }
  }
);
