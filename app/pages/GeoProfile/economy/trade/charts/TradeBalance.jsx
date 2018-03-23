import React from "react";
import { Section } from "datawheel-canon";
import values from "lodash/values";
import { LinePlot } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { tradeBalanceColorScale } from "helpers/colors";
import { melt, replaceKeyNames } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

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

		const locale = i18n.language;
		const classSvg = "trade-balance";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>{t("Trade Balance")}</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				<LinePlot
					className={classSvg}
					config={{
						height: 200,
						data: path,
						groupBy: "variable",
						x: "ID Year",
						y: "value",
						xConfig: {
							tickSize: 0,
							title: false
						},
						yConfig: {
							title: t("US$"),
							tickFormat: tick => numeral(tick, locale).format("(0 a)")
						},
						shapeConfig: {
							Line: {
								stroke: d => tradeBalanceColorScale(d["variable"]),
								strokeWidth: 2
							}
						},
						tooltipConfig: {
							title: d => {
								return d.variable;
							},
							body: d => {
								var body = "";
								if (!(d["ID Year"] instanceof Array)) {
									body =
										"US" +
										numeral(d.value, locale).format("$ (0.[0] a)") +
										" - " +
										d["ID Year"];
								}
								return body;
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
