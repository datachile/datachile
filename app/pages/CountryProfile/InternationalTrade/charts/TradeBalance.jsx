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
import NoDataAvailable from "components/NoDataAvailable";

class TradeBalance extends Section {
	state = {
		chart: true
	};

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
					"Continent",
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

	prepareData = data => {
		const t = this.props.t;
		if (data.data && data.data.length) {
			const tKeys = {
				FOB: t("trade_balance.fob"),
				CIF: t("trade_balance.cif"),
				"Trade Balance": t("trade_balance.trade_balance")
			};
			data.data = replaceKeyNames(data.data, tKeys);
			return melt(data.data, ["ID Year"], values(tKeys));
		} else {
			this.setState({ chart: false });
		}
	};

	render() {
		const { t, className, i18n } = this.props;

		const locale = i18n.language;
		const path = this.context.data.path_trade_balance_country;
		const classSvg = "trade-balance";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>{t("Trade Balance")}</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				{this.state.chart ? (
					<LinePlot
						className={classSvg}
						config={{
							height: 400,
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
								tickFormat: tick => numeral(tick, locale).format("(0.[0]a)")
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
									const kind = /export/i.test(d.variable)
										? " FOB"
										: /import/i.test(d.variable) ? " CIF" : "";
									return Array.isArray(d["ID Year"])
										? ""
										: "US " +
												numeral(d.value, locale).format("$ (0.[0]a)") +
												kind +
												" - " +
												d["ID Year"];
								}
							}
						}}
						dataFormat={this.prepareData}
					/>
				) : (
					<NoDataAvailable />
				)}
				<SourceNote cube="exports_and_imports" />
			</div>
		);
	}
}

export default translate()(TradeBalance);
