import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { Treemap } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";

export default translate()(
  class MigrationByEducation extends Section {
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
              .drilldown("Education", "Education")
              .measure("Number of visas"),
            "Subregion",
            "Country",
            store.i18n.locale,
            false
          );

          return {
            key: "path_country_migration_by_activity",
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

      if (!i18n.language) return null;

      const locale = i18n.language.split("-")[0];

      const path = this.context.data.path_country_migration_by_activity;

      return (
        <div className={className}>
          <h3 className="chart-title">
            <span>{t("Migration By Education")}</span>
            <ExportLink path={path} />
          </h3>
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: "ID Education",
              label: d => d["Education"],
              sum: d => d["Number of visas"],
              time: "ID Year",
              shapeConfig: {
                fill: d => ordinalColorScale(d["ID Education"])
              },
              tooltipConfig: {
                title: d => d["Education"],
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
