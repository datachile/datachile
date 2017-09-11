import React from "react";
import { Section } from "datawheel-canon";

import { LinePlot } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";

import { ordinalColorScale } from "helpers/colors";
import { melt, getGeoObject } from "helpers/dataUtils";

import { translate } from "react-i18next";

export default translate()(
  class TradeBalance extends Section {
    static need = [
      (params, store) => {
        const geo = getGeoObject(params);
        const prm = mondrianClient.cube("exports_and_imports").then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .drilldown("Date", "Year")
              .measure("FOB")
              .measure("CIF")
              .measure("Trade Balance"),
            store.i18n.locale
          );

          return {
            key: "path_trade_balance",
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
      const path = this.context.data.path_trade_balance;

      return (
        <div className={className}>
          <h3 className="chart-title">
            {t("Trade Balance")}
          </h3>
          <LinePlot
            config={{
              height: 500,
              data: path,
              groupBy: "variable",
              x: "ID Year",
              y: "value",
              xConfig:{
                tickSize:0,
                title:false
              },
              yConfig:{
                title:t("")
              },
              shapeConfig: {
                Line:{
                  stroke: d => ordinalColorScale(d["variable"]),
                  "strokeWidth": 3
                }
              }
            }}
            dataFormat={data =>
              melt(data.data, ["ID Year"], ["FOB", "CIF", "Trade Balance"])}
          />
        </div>
      );
    }
  }
);
