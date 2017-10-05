import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";

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
      const { t, className, i18n } = this.props;
      const path = this.context.data.path_exports_by_destination;
      const locale = i18n.language.split("-")[0];
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
              tooltipConfig:{
                title: d=>{
                  return d["Country"] instanceof Array ? d["Continent"] : d["Country"];
                },
                body: d=>numeral(d['FOB US'], locale).format("(USD 0 a)") + "<br/><a>"+t("tooltip.to_profile")+"</a>"
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
