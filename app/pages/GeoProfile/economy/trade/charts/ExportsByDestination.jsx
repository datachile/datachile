import React from "react";
import { Section } from "datawheel-canon";
import { ordinalColorScale } from "helpers/colors";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { translate } from "react-i18next";

export default translate()(
  class ExportsByDestination extends Section {
    static need = [
      (params, store) => {
        const geo = getGeoObject(params);
        const prm = mondrianClient.cube("exports").then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", true)
              .drilldown("Destination Country", "Country")
              .drilldown("Date", "Year")
              .measure("FOB US"),
            store.i18n.locale
          );
          return {
            key: "path_exports_by_destination",
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
      const path = this.context.data.path_exports_by_destination;
      return (
        <div className={className}>
          <h3 className="chart-title">
            {t("Exports By Destination")}
          </h3>
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: ["ID Continent", "ID Country"],
              label: d =>
                d["Country"] instanceof Array ? d["Continent"] : d["Country"],
              sum: d => d["FOB US"],
              time: "ID Year" ,
              shapeConfig: {
                  fill: d => ordinalColorScale(d["ID Continent"])
              },
              legendConfig: {
                  shapeConfig:{
                      width:40,
                      height:40,
                      backgroundImage: d => "/images/legend/continent/"+d["ID Continent"]+".png",
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
