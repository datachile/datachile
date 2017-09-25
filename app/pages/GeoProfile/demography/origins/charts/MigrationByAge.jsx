import React from "react";
import { Section } from "datawheel-canon";

import { BarChart } from "d3plus-react";
import { ordinalColorScale } from "helpers/colors";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { translate } from "react-i18next";

export default translate()(
  class MigrationByAge extends Section {
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
              .drilldown("Calculated Age Range", "Calculated Age Range", "Age Range")
              .measure("Number of visas"),
            store.i18n.locale
          );
          return {
            key: "path_migration_by_age",
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
      const path = this.context.data.path_migration_by_age;

      return (
        <div className={className}>
          <h3 className="chart-title">
            {t("Migration By Age")}
          </h3>
          <BarChart
            config={{
              height: 500,
              data: path,
              groupBy: "ID Age Range",
              label: d =>
                d['Age Range'],
              time: "ID Year",
              x: false,
              y: "Number of visas",
              shapeConfig: {
                  fill: d => ordinalColorScale(1),
              },
              xConfig:{
                tickSize:0,
                title:t("Age Range")
              },
              yConfig:{
                title:t("People")
              },
              barPadding: 20,
              groupPadding: 40
            }}
            
            dataFormat={data => data.data}
          />
        </div>
      );
    }
  }
);
