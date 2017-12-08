import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";

export default translate()(
  class MigrationBySex extends Section {
    static need = [
      (params, store) => {
        const country = getLevelObject(params);
        const prm = mondrianClient.cube("immigration").then(cube => {
          const q = levelCut(
            country,
            "Origin Country",
            "Country",
            cube.query
              .option("parents", true)
              .drilldown("Date", "Year")
              .drilldown("Calculated Age Range", "Age Range")
              .measure("Number of visas"),
            "Subregion",
            "Country",
            store.i18n.locale,
            false
          );

          return {
            key: "path_country_migration_by_age",
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

      const locale = i18n.locale;

      const path = this.context.data.path_country_migration_by_age;

      return (
        <div className={className}>
          <h3 className="chart-title">
            <span>{t("Migration By Calculated Age Range")}</span>
            <ExportLink path={path} />
          </h3>
          <BarChart
            config={{
              height: 500,
              data: path,
              groupBy: "ID Age Range",
              label: d => d["Calculated Age Range"],
              time: "ID Year",
              x: "Age Range",
              y: "Number of visas",
              shapeConfig: {
                fill: () => ordinalColorScale(2)
              },
              xConfig: {
                tickSize: 0,
                title: false
              },
              yConfig: {
                title: t("Visas"),
                tickFormat: tick => numeral(tick, locale).format("(0.0 a)")
              },
              barPadding: 20,
              groupPadding: 40,
              tooltipConfig: {
                title: d => d["Calculated Age Range"],
                body: d =>
                  numeral(d["Number of visas"], locale).format("( 0,0 )") +
                  " " +
                  t("visas")
              },
              legendConfig: {
                label: false,
                shapeConfig: false
              }
            }}
            dataFormat={data => data.data}
          />
        </div>
      );
    }
  }
);
