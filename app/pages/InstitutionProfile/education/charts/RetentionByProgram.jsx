import React from "react";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";

import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";

export default translate()(
  class RetentionByProgram extends Section {
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
                .measure("Avg Retention 1st year")
                .measure("Number of records"),
              "Higher Institution Subgroup",
              "Higher Institution",
              store.i18n.locale,
              false
            );

            return {
              key: "path_institution_retention_by_program",
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
      const path = this.context.data.path_institution_retention_by_program;
      const locale = i18n.language;

      return (
        <div className={className}>
          <h3 className="chart-title">
            <span>{t("Retention by Program")}</span>
            <ExportLink path={path} />
          </h3>
          <BarChart
            config={{
              height: 400,
              data: path,
              groupBy: "ID Career Group",
              label: d => d["Avg Retention 1st year"],
              x: "Career",
              y: "Avg Retention 1st year",
              shapeConfig: {
                fill: d => ordinalColorScale(d["ID Career Group"])
              },
              xConfig: {
                tickSize: 0,
                title: false
              },
              yConfig: {
                title: t("Retention"),
                tickFormat: tick => numeral(tick, locale).format("0%")
              },
              xSort: (a, b) => {
                return a["Avg Retention 1st year"] > b["Avg Retention 1st year"]
                  ? -1
                  : 1;
              },
              //barPadding: 20,
              //groupPadding: 40,
              tooltipConfig: {
                title: d =>
                  d["Career"] instanceof Array
                    ? d["Career Group"]
                    : d["Career"],
                body: d =>
                  d["Career"] instanceof Array
                    ? numeral(d["Number of records"], locale).format(
                        "( 0,0 )"
                      ) +
                      " " +
                      t("careers")
                    : numeral(d["Avg Retention 1st year"], locale).format(
                        "( 0.0% )"
                      )
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
                  o["Avg Retention 1st year"] != null &&
                  o["Avg Retention 1st year"] > 0 &&
                  o["Number of records"] != null &&
                  o["Number of records"] > 0
              );

              return orderBy(filtered, ["Avg Retention 1st year"], ["desc"]);
            }}
          />
        </div>
      );
    }
  }
);
