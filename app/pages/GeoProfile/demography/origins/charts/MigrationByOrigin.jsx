import React from "react";
import { Section } from "datawheel-canon";
import { ordinalColorScale } from "helpers/colors";
import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { translate } from "react-i18next";

export default translate()(
  class MigrationByOrigin extends Section {
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
              .drilldown("Origin Country", "Country", "Country")
              .measure("Number of visas"),
            store.i18n.locale
          );
          return {
            key: "path_migration_by_origin",
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
      const path = this.context.data.path_migration_by_origin;

      return (
        <div className={className}>
          <h3 className="chart-title">
            {t("Migration By Origin")}
          </h3>
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: ["ID Continent", "ID Country"],
              label: d =>
                d["Country"] instanceof Array ? d["Continent"] : d["Country"],
              sum: d => d["Number of visas"],
              time: "ID Year",
              shapeConfig: {
                  fill: d => ordinalColorScale(d["ID Continent"])
              }
            }}
            dataFormat={data => data.data}
          />
        </div>
      );
    }
  }
);
