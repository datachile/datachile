import React, { Component } from "react";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

class OutputByIndustry extends Section {
  static need = [
    (params, store) => {
      console.log("PARAMS CHART", params);
      const geo = getGeoObject(params);
      const prm = mondrianClient.cube("tax_data").then(cube => {
        var q = geoCut(
          geo,
          "Tax Geography",
          cube.query
            .option("parents", true)
            .drilldown("ISICrev4", "Level 2")
            .drilldown("Date", "Year")
            .measure("Output"),
          store.i18n.locale
        );

        return {
          key: "path_industry_output",
          data: "http://localhost:9292" + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const path = this.context.data.path_industry_output;
    const { t } = this.props;
    return (
      <div className="lost-1-2">
        <Treemap
          config={{
            height: 552,
            data: path,
            groupBy: ["ID Level 1", "ID Level 2"],
            label: d =>
              d["Level 2"] instanceof Array ? d["Level 1"] : d["Level 2"],
            sum: d => d["Output"],
            time: "ID Year",
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID Level 1"])
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(OutputByIndustry);
