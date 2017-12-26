import React from "react";
import { Section } from "datawheel-canon";
import flattenDeep from "lodash/flattenDeep";
import { LinePlot } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { tradeBalanceColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";

class TradeBalance extends Section {
  static need = [
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient
        .cube("exports")
        .then(cube => {
          var q = levelCut(
            product,
            "Export HS",
            "HS",
            cube.query
              .option("parents", true)
              .drilldown("Date", "Date", "Year")
              .measure("FOB US"),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          return mondrianClient.query(q);
        })
        .then(res => {
          return {
            key: "datum_exports_per_year",
            data: flattenDeep(res.data.values)
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient
        .cube("imports")
        .then(cube => {
          var q = levelCut(
            product,
            "Import HS",
            "HS",
            cube.query
              .option("parents", true)
              .drilldown("Date", "Date", "Year")
              .measure("CIF US"),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          return mondrianClient.query(q);
        })
        .then(res => {
          return {
            key: "datum_imports_per_year",
            data: flattenDeep(res.data.values)
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
    const path = this.context.data.path_trade_balance;

    const {
      datum_imports_per_year,
      datum_exports_per_year
    } = this.context.data;
    const locale = i18n.locale;

    const data = datum_exports_per_year
      ? datum_exports_per_year.reduce((all, item, key) => {
          all.push({ variable: "Exports", value: item, year: key + 2002 });
          all.push({
            variable: "Imports",
            value: datum_imports_per_year[key],
            year: key + 2002
          });
          all.push({
            variable: "Trade Balance",
            value: datum_imports_per_year[key] - item,
            year: key + 2002
          });

          return all;
        }, [])
      : [];

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Trade Balance")}</span>
          <ExportLink path={path} />
        </h3>
        <LinePlot
          config={{
            height: 500,
            data: data,
            groupBy: "variable",
            x: "year",
            y: "value",
            xConfig: {
              tickSize: 0,
              title: false
            },
            yConfig: {
              title: t("USD"),
              tickFormat: tick => numeral(tick, locale).format("(0.0 a)")
            },
            shapeConfig: {
              Line: {
                stroke: d => tradeBalanceColorScale(d["variable"]),
                strokeWidth: 2
              }
            },
            tooltipConfig: {
              body: d =>
                "<div>" +
                d["year"] +
                ": " +
                numeral(d["value"], locale).format("(0.00 a)") +
                "</div>"
            }
          }}
        />
      </div>
    );
  }
}

export default translate()(TradeBalance);
