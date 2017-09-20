import React from "react";
import _ from "lodash";
import { Section } from "datawheel-canon";

import { BarChart } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { translate } from "react-i18next";

export default translate()(
  class MigrationByActivity extends Section {
    static need = [
      (params, store) => {
        const geo = getGeoObject(params);
        const prm = mondrianClient.cube("immigration").then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", true)
              .drilldown("Date", "Date", "Year")
              .drilldown("Activity", "Activity", "Activity")
              .measure("Number of visas"),
            store.i18n.locale
          );
          return {
            key: "path_migration_by_activity",
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
      const { t, className } = this.props;
      const path = this.context.data.path_migration_by_activity;

      return (
        <div className={className}>
          <h3 className="chart-title">
            {t("Migration By Activity")}
          </h3>
          <BarChart
            config={{
              height: 500,
              data: path,
              groupBy: "ID Activity",
              label: d =>
                d['Activity'] + ': ' + d["Number of visas"],
              time: "ID Year",
              x: "Number of visas",
              y: "Activity",
              shapeConfig: {
                  fill: d => ordinalColorScale(2),
                  label: false
              },
              discrete:"y",
              xConfig:{ 
                tickSize:0,
                title:t("Number of visas")
              },
              yConfig:{
                barConfig: {"stroke-width": 0},
                tickSize:0,
                title:false
              },
              barPadding: 0,
              groupPadding: 5,
              legendConfig: {
                  label: false,
                  shapeConfig:false
              }
            }}
            dataFormat={function(data){
              var filtered = _.filter(data.data,(o) => o["Number of visas"] != null && o["Number of visas"] > 0);              
              return _.orderBy(filtered,["Number of visas"],["desc"])}
            } 
          />
        </div>
      );
    }
  }
);
