import React from "react";
import { Section } from "datawheel-canon";
import { LinePlot } from "d3plus-react";
import { translate } from "react-i18next";

import { sources } from "helpers/consts";
import { joinDataByYear } from "helpers/dataUtils";

import { tradeBalanceColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class TradeBalance extends Section {
  static need = [];

  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.path_trade_balance;

    let { datum_exports_by_year, datum_imports_by_year } = this.context.data;
    const locale = i18n.language;

    datum_exports_by_year = joinDataByYear(
      datum_exports_by_year,
      "FOB US",
      sources.exports.min_year,
      sources.exports.year
    );

    datum_imports_by_year = joinDataByYear(
      datum_imports_by_year,
      "CIF US",
      sources.exports.min_year,
      sources.exports.year
    );

    const data = datum_exports_by_year
      ? datum_exports_by_year.reduce((all, item, key) => {
          all.push({
            variable: "Exports",
            value: item,
            year: key + sources.exports.min_year
          });
          all.push({
            variable: "Imports",
            value: datum_imports_by_year[key],
            year: key + sources.imports.min_year
          });
          all.push({
            variable: "Trade Balance",
            value: item - datum_imports_by_year[key],
            year: key + sources.imports.min_year
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
              tickFormat: tick => numeral(tick, locale).format("($ 0.[00] a)")
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
                ": USD " +
                numeral(d["value"], locale).format("($ 0.00 a)") +
                "</div>"
            }
          }}
        />
        <SourceNote cube="imports" />
      </div>
    );
  }
}

export default translate()(TradeBalance);
