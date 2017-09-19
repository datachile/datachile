import React, { Component } from "react";

import { BarChart } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale,COLORS_GENDER } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

class SalariesByOccupation extends Section {
  static need = [
    (params, store) => {
      
      const geo = getGeoObject(params);
      const prm = mondrianClient.cube("nesi_income").then(cube => {
        var q = geoCut(
          geo,
          "Geography",
          cube.query
            .option("parents", true)
            .drilldown("ISCO", "ISCO", "ISCO")
            .drilldown("Date", "Date", "Year")
            .drilldown("Sex", "Sex", "Sex")
            .measure("Median Income"),
          store.i18n.locale
        );

        return {
          key: "path_salaries_by_occupation",
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
    const path = this.context.data.path_salaries_by_occupation;
    const { t, className } = this.props;
    return (
      <div className={className}>
        <h3 className="chart-title">
          {t("Salaries By Occupation")}
        </h3>
        <BarChart
            config={{
              height: 500,
              data: path,
              groupBy: ["ID Sex"],
              label: d =>
                d['ISCO'],
              time: "ID Year",
              x: "ISCO",
              y: "Median Income",
              shapeConfig: {
                  fill: d => COLORS_GENDER[d["ID Sex"]],
              },
              xConfig:{
                tickSize:0,
                title:false
              },
              yConfig:{
                title:t("Median Income")
              },
              barPadding: 0,
              groupPadding: 10,
              legendConfig: {
                  label: false,
                  shapeConfig:{
                      width:40,
                      height:40,
                      backgroundImage: d => "/images/legend/sex/"+d["ID Sex"]+".png",
                  }
              }
            }}
            dataFormat={data => data.data}
          />
      </div>
    );
  }
}

export default translate()(SalariesByOccupation);