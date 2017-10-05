import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import { numeral } from "helpers/formatters";
import { ordinalColorScale } from "helpers/colors";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";

export default translate()(
  class ImportsByOrigin extends Section {
    static need = [
      (params, store) => {
        const geo = getGeoObject(params);
        const prm = mondrianClient.cube("imports").then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", true)
              .drilldown("Origin Country", "Country")
              .drilldown("Date", "Year")
              .measure("CIF US"),
            store.i18n.locale
          );

          return {
            key: "path_imports_by_origin",
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
      const path = this.context.data.path_imports_by_origin;
      const locale = i18n.language.split("-")[0];

      return (
        <div className={className}>
          <h3 className="chart-title">
            {t("Imports By Origin")}
          </h3>
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: ["ID Continent", "ID Country"],
              label: d =>
                d["Country"] instanceof Array ? d["Continent"] : d["Country"],
              sum: d => d["CIF US"],
              time: "ID Year",
              shapeConfig: {
                  fill: d => ordinalColorScale(d["ID Continent"])
              },
              tooltipConfig:{
                title: d=>{
                  return d["Country"] instanceof Array ? d["Continent"] : d["Country"];
                },
                body: d=>numeral(d['CIF US'], locale).format("(USD 0 a)") + "<br/><a>"+t("tooltip.to_profile")+"</a>"
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
