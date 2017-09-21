import React, { Component } from "react";

import { BarChart } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

class IncomeByAge extends Section {
  static need = [
    (params, store) => {
      
      var geo = getGeoObject(params);
      const prm = mondrianClient.cube("nesi_income").then(cube => {
        var q = geoCut(
          geo,
          "Geography",
          cube.query
            .option("parents", true)
            .drilldown("Date", "Date", "Year")
            .drilldown("Income Range", "Income Range", "Income Range")
            .drilldown("Age Range", "Age Range", "Age Range")
            .measure("Expansion Factor"),
          store.i18n.locale
        );

        return {
          key: "path_income_by_age",
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
    const path = this.context.data.path_income_by_age;
    const { t, className } = this.props;
    return (
      <div className={className}>
        <h3 className="chart-title">
          {t("Income By Age")}
        </h3>
        <BarChart
            config={{
              height: 500,
              data: path,
              groupBy: "ID Age Range",
              label: d =>
                d['Age Range'],
              time: "ID Year",
              x: "Income Range",
              y: "Expansion Factor",
              shapeConfig: {
                  fill: d => ordinalColorScale(d["ID Age Range"]),
                  label: false
              },
              xConfig:{
                tickSize:0,
                title:false
              },
              xSort:(a,b) => a['ID Income Range']>b['ID Income Range'] ? 1:-1,
              yConfig:{
                title:t("People")
              },
              barPadding: 0,
              groupPadding: 5,
              legendConfig: {
                  label: false,
                  shapeConfig:{
                      width:40,
                      height:40
                  }
              }
            }}
            
            dataFormat={data => data.data}
          />
      </div>
    );
  }
}

export default translate()(IncomeByAge);
