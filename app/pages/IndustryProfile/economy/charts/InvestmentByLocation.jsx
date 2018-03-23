import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { regionsColorScale } from "helpers/colors";
import {
	numeral,
	slugifyItem,
	getNumberFromTotalString
} from "helpers/formatters";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import TreemapStacked from "components/TreemapStacked";

class InvestmentByLocation extends Section {
	static need = [
		(params, store) => {
			var industry = getLevelObject(params);
			const prm = mondrianClient.cube("tax_data").then(cube => {
				var q = levelCut(
					industry,
					"ISICrev4",
					"ISICrev4",
					cube.query
						.option("parents", true)
						.drilldown("Tax Geography", "Geography", "Comuna")
						.drilldown("Date", "Date", "Year")
						.measure("Investment"),
					"Level 1",
					"Level 2",
					store.i18n.locale
				);

				return {
					key: "industry_investment_by_region",
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
		const path = this.context.data.industry_investment_by_region;
		const industry = this.context.data.industry;

		const locale = i18n.language;
		const classSvg = "investment-by-location";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>
						{t("Investment By Comuna (Legal address)")}
						{industry &&
							industry.parent && (
								<span>
									:{" "}
									{industry.parent ? industry.parent.caption : industry.caption}
								</span>
							)}
					</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				<TreemapStacked
					className={classSvg}
					path={path}
					msrName="Investment"
					drilldowns={["Region", "Comuna"]}
					config={{
						label: d =>
							d["Comuna"] instanceof Array ? d["Region"] : d["Comuna"],
						total: d => d["Investment"],
						totalConfig: {
							text: d =>
								"Total: CLP" +
								numeral(getNumberFromTotalString(d.text), locale).format(
									"($ 0.[00] a)"
								)
						},
						shapeConfig: {
							fill: d => regionsColorScale("r" + d["ID Region"])
						},
						on: {
							click: d => {
								//if (!(d["ID Comuna"] instanceof Array)) {
								var url = slugifyItem(
									"geo",
									d["ID Region"],
									d["Region"],
									d["ID Comuna"] instanceof Array ? false : d["ID Comuna"],
									d["Comuna"] instanceof Array ? false : d["Comuna"]
								);
								browserHistory.push(url);
								//}
							}
						},
						tooltipConfig: {
							title: d => {
								return d["Comuna"] instanceof Array ? d["Region"] : d["Comuna"];
							},
							body: d => {
								const link =
									d["ID Comuna"] instanceof Array
										? ""
										: "<br/><a>" + t("tooltip.to_profile") + "</a>";
								return (
									numeral(d["Investment"], locale).format("(USD 0 a)") + link
								);
							}
						},
						legendTooltip: {
							title: d => {
								return d["Region"];
							},
							body: d => {
								const link = "<br/><a>" + t("tooltip.to_profile") + "</a>";
								return (
									numeral(d["Investment"], locale).format("(USD 0 a)") + link
								);
							}
						},
						legendConfig: {
							shapeConfig: {
								width: 25,
								height: 25,
								backgroundImage: d =>
									"/images/legend/region/" + d["ID Region"] + ".png"
							}
						},
						yConfig: {
							title: t("CLP$"),
							tickFormat: tick => numeral(tick, locale).format("(0 a)")
						}
					}}
				/>

				<SourceNote cube="tax_data" />
			</div>
		);
	}
}

export default translate()(InvestmentByLocation);
