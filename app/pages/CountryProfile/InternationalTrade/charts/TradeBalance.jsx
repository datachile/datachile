import React from "react";
import { Section } from "datawheel-canon";
import values from "lodash/values";
import { translate } from "react-i18next";
import { LinePlot } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";
import { melt, getLevelObject, replaceKeyNames } from "helpers/dataUtils";
import { tradeBalanceColorScale } from "helpers/colors";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

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
            .measure("FOB")
            .measure("CIF")
            .measure("Trade Balance"),
          "Subregion",
          "Country",
          store.i18n.locale,
          false
        );

        return {
          key: "path_trade_balance_country",
          data: __API__ + q.path("jsonrecords")
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

    const locale = i18n.language;
    const path = this.context.data.path_trade_balance_country;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Trade Balance")}</span>
          <ExportLink path={path} />
        </h3>
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
              tickFormat: tick => numeral(tick, locale).format("0 a")
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
            return melt(data.data, ["ID Year"], values(tKeys));
          }}
        />
        <SourceNote cube="exports_and_imports" />
      </div>
    );
  }
}

export default translate()(TradeBalance);
