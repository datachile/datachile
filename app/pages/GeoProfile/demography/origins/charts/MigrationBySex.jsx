import React from "react";
import { Section } from "datawheel-canon";

import { BarChart } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { translate } from "react-i18next";

export default translate()(
  class MigrationBySex extends Section {
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
              .drilldown("Sex", "Sex", "Sex")
              .measure("Number of visas"),
            store.i18n.locale
          );
          return {
            key: "path_migration_by_sex",
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
      const path = this.context.data.path_migration_by_sex;

      return (
        <div className={className}>
          <h3 className="chart-title">
            {t("Migration By Sex")}
          </h3>
          <BarChart
            config={{
              height: 500,
              data: path,
              groupBy: "ID Sex",
              label: d =>
                d['Sex'],
              time: "ID Year",
              x: "ID Sex",
              y: "Number of visas"
            }}
            
            dataFormat={data => data.data}
          />
        </div>
      );
    }
  }
);
