import React from "react";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";

import { Section } from "@datawheel/canon-core";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";

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
                .drilldown("Careers", "Careers", "Career")
                .drilldown(
                  "Avg Income 4th year",
                  "Avg Income 4th year",
                  "Avg Income 4th year"
                )
                .measure("Number of records"),
              "Higher Institution Subgroup",
              "Higher Institution",
              store.i18n.locale,
              false
            );

            return {
              key: "path_institution_wages_by_program",
              data: __API__ + q.path("jsonrecords")
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

      const locale = i18n.language;

      return (
        <div className={className}>
          <h3 className="chart-title">
            <span>{t("Wages by Program")}</span>
            <ExportLink path={path} />
          </h3>
          <BarChart
            config={{
              height: 400,
              data: path,
              groupBy: ["ID Career"],
              label: d => d["ID Avg Income 4th year"],
              x: "Career",
              y: "ID Avg Income 4th year",
              shapeConfig: {
                fill: d => ordinalColorScale(1)
              },
              xConfig: {
                tickSize: 0,
                title: false
              },
              yConfig: {
                title: t("Wages"),
                tickFormat: tick => numeral(tick, locale).format("(0.0a)")
              },
              xSort: (a, b) => {
                return a["ID Avg Income 4th year"] > b["ID Avg Income 4th year"]
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
              var filtered = filter(
                data.data,
                o =>
                  o["ID Avg Income 4th year"] != null &&
                  o["ID Avg Income 4th year"] > 0 &&
                  o["Number of records"] != null &&
                  o["Number of records"] > 0
              );
              return orderBy(filtered, ["ID Avg Income 4th year"], ["desc"]);
            }}
          />
        </div>
      );
    }
  }
);
