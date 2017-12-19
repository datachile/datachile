import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { COLORS_GENDER } from "helpers/colors";
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
              .drilldown("Sex", "Sex")
              .measure("Number of visas"),
            "Subregion",
            "Country",
            store.i18n.locale,
            false
          );

          return {
            key: "path_country_migration_by_sex",
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

      const path = this.context.data.path_country_migration_by_sex;
      const locale = i18n.locale;

      return (
        <div className={className}>
          <h3 className="chart-title">
            <span>{t("Migration By Sex")}</span>
            <ExportLink path={path} />
          </h3>
          <BarChart
            config={{
              height: 500,
              data: path,
              groupBy: "ID Sex",
              label: d => d["Sex"],
              time: "ID Year",
              x: false,
              y: "Number of visas",
              shapeConfig: {
                fill: d => COLORS_GENDER[d["ID Sex"]]
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
                title: d => d["Sex"],
                body: d =>
                  numeral(d["Number of visas"], locale).format("( 0,0 )") +
                  " " +
                  t("visas")
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
        </div>
      );
    }
  }
);
