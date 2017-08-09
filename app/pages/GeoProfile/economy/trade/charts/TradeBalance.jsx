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
      const { t } = this.props;
      const path = this.context.data.path_trade_balance;

      return (
        <div className="lost-1-2">
          <LinePlot
            config={{
              data: path,
              groupBy: "variable",
              x: "ID Year",
              y: "value"
            }}
            dataFormat={data =>
              melt(data.data, ["ID Year"], ["FOB", "CIF", "Trade Balance"])}
          />
        </div>
      );
    }
  }
);
