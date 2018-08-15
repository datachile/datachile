import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class SalariesByCategory extends Section {
	static need = [
		(params, store) => {
			let geo = getGeoObject(params);
			//force to region query on comuna profile
			if (geo.type === "comuna") {
				geo = geo.ancestor;
			}
			return simpleGeoChartNeed(
				"path_salaries_by_category",
				"nesi_income",
				["Median Income"],
				{
					drillDowns: [["ICSE", "ICSE", "ICSE"], ["Date", "Date", "Year"]],
					options: { parents: true }
				},
				geo
			)(params, store);
		}
	];

	render() {
		const path = this.context.data.path_salaries_by_category;
		const { t, className, i18n } = this.props;

		const locale = i18n.language;
		const classSvg = "salaries-by-category";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>{t("Salaries By Category")}</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				<BarChart
					className={classSvg}
					config={{
						height: 400,
						data: path,
						groupBy: "ID ICSE",
						label: d => d["ICSE"],
						time: "ID Year",
						x: "Median Income",
						y: "ICSE",
						shapeConfig: {
							fill: d => ordinalColorScale(d["ID ICSE"])
						},
						tooltipConfig: {
							title: d => d["ICSE"],
							body: d =>
								numeral(d["Median Income"], locale).format("(0.[0]a)") + " CLP"
						},
						discrete: "y",
						xConfig: {
							tickSize: 0,
							title: t("Monthly Median Income CLP"),
							tickFormat: tick => numeral(tick, locale).format("(0.[0]a)")
						},
						ySort: (a, b) => {
							return a["Median Income"] > b["Median Income"] ? 1 : -1;
						},
						yConfig: {
							barConfig: { "stroke-width": 0 },
							tickSize: 0,
							ticks: [],
							title: t("Occupational Category")
						},
						barPadding: 0,
						groupPadding: 5,
						legend: false,
						legendConfig: {
							label: false
						}
					}}
					dataFormat={data => data.data}
				/>
				<SourceNote cube="nesi_income" />
			</div>
		);
	}
}

export default translate()(SalariesByCategory);
