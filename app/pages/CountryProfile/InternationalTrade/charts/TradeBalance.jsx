import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { LinePlot } from "d3plus-react";
import { browserHistory } from "react-router";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { numeral, slugifyItem } from "helpers/formatters";
import { tradeBalanceColorScale } from "helpers/colors";
import { getLevelObject } from "helpers/dataUtils";

class TradeBalance extends Section {
  static need = [
    (params, store) => {
      const country = getLevelObject(params);

      const prm = mondrianClient.cube("exports_and_imports").then(cube => {
        const q = levelCut(
          country,
          "Country",
          "Country",
          cube.query
            .option("parents", true)
            .drilldown("Date", "Date", "Year")
            .measure("Trade Balance"),
          "Subregion",
          "Country",
          store.i18n.locale,
          false
        );

        return {
          key: "path_trade_balance_country",
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
    if (!i18n.language) return null;
    const locale = i18n.language.split("-")[0];
    const path = this.context.data.path_trade_balance_country;

    return (
      <div className={className}>
        <h3 className="chart-title">{t("Trade Balance")}</h3>
        <LinePlot
          config={{
            height: 500,
            data: path,
            x: "ID Year",
            y: "Trade Balance",
            xConfig: {
              tickSize: 0,
              title: false
            },
            yConfig: {
              title: t("USD"),
              tickFormat: tick => numeral(tick, locale).format("0 a")
            },
            shapeConfig: {
              Line: {
                //                stroke: d => tradeBalanceColorScale(d["Trade Balance"]),
                strokeWidth: 4
              }
            }
          }}
          dataFormat={data => data.data.filter(d => d["ID Year"] >= 2002)}
        />
      </div>
    );
  }
}

export default translate()(TradeBalance);
