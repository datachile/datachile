import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { Treemap } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

export default translate()(
  class MigrationByActivity extends Section {
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
                  .drilldown("Activity", "Activity")
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
      const path = this.context.data.path_country_migration_by_activity;
      const locale = i18n.language.split("-")[0];

      return (
        <div className={className}>
          <h3 className="chart-title">
            {t("Migration By Activity")}
          </h3>
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: "ID Activity",
              label: d =>
                d['Activity'],
              sum: d => d["Number of visas"],
              time: "ID Year",
              shapeConfig: {
                fill: d => ordinalColorScale(d["ID Activity"])
              },
              tooltipConfig:{
                title: d => d["Activity"],
                body: d => numeral(d['Number of visas'], locale).format("( 0,0 )") + " " + t("visas")
              },
              legendConfig: {
                label: false,
                shapeConfig:false
              }
            }}

          dataFormat={data => { console.log(data.data); return data.data;}}
          />
        </div>
      );
    }
  }
);
