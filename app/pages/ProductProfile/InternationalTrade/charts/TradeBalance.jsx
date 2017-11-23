import React from "react";
import { Section } from "datawheel-canon";
import _ from "lodash";
import { LinePlot } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { tradeBalanceColorScale } from "helpers/colors";
import { melt, getGeoObject, replaceKeyNames } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

class TradeBalance extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_trade_balance",
      "exports_and_imports",
      ["FOB", "CIF", "Trade Balance"],
      { drillDowns: [["Date", "Year"]] }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.path_trade_balance;
    if (!i18n.language) return null;
    const locale = i18n.language.split("-")[0];

    return (
      <div className={className}>
        <h3 className="chart-title">{t("Trade Balance")}</h3>
        <LinePlot
          config={{
            height: 500,
            data: path,
            groupBy: "variable",
            x: "ID Year",
            y: "value",
            xConfig: {
              tickSize: 0,
              title: false
            },
            yConfig: {
              title: t("USD"),
              tickFormat: tick => numeral(tick, locale).format("(0 a)")
            },
            shapeConfig: {
              Line: {
                stroke: d => tradeBalanceColorScale(d["variable"]),
                strokeWidth: 2
              }
            }
          }}
          dataFormat={data => {
            const tKeys = {
              FOB: t("trade_balance.fob"),
              CIF: t("trade_balance.cif"),
              "Trade Balance": t("trade_balance.trade_balance")
            };
            data.data = replaceKeyNames(data.data, tKeys);
            return melt(data.data, ["ID Year"], _.values(tKeys));
          }}
        />
      </div>
    );
  }
}

export default translate()(TradeBalance);
