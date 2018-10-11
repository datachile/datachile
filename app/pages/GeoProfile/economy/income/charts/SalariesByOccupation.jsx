import React from "react";
import { Section } from "@datawheel/canon-core";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { COLORS_GENDER } from "helpers/colors";
import { numeral } from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class SalariesByOccupation extends Section {
	static need = [
		(params, store) => {
			let geo = getGeoObject(params);
			//force to region query on comuna profile
			if (geo.type === "comuna") {
				geo = geo.ancestor;
			}
			return simpleGeoChartNeed(
				"path_salaries_by_occupation",
				"nesi_income",
				["Median Income"],
				{
					drillDowns: [
						["ISCO", "ISCO", "ISCO"],
						["Date", "Date", "Year"],
						["Sex", "Sex", "Sex"]
					],
					options: { parents: true }
				},
				geo
			)(params, store);
		}
	];

	render() {
		const path = this.context.data.path_salaries_by_occupation;
		const { t, className, i18n } = this.props;

		const locale = i18n.language;
		const classSvg = "salaries-by-occupation";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>
						{t("Salaries By Occupation")}
						<SourceTooltip cube="nesi_income" />
					</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				<BarChart
					className={classSvg}
					config={{
						height: 400,
						data: path,
						groupBy: ["ID Sex"],
						label: d => d["ISCO"],
						time: "ID Year",
						x: "ISCO",
						y: "Median Income",
						shapeConfig: {
							fill: d => COLORS_GENDER[d["ID Sex"]],
							label: () => ""
						},
						xConfig: {
							tickSize: 0,
							title: false
						},
						yConfig: {
							title: t("Median Income CLP"),
							tickFormat: tick => numeral(tick, locale).format("(0.[0]a)")
						},
						barPadding: 0,
						groupPadding: 10,
						legendConfig: {
							label: false,
							shapeConfig: {
								backgroundImage: d =>
									"/images/legend/sex/" + d["ID Sex"] + ".png"
							}
						}
					}}
					dataFormat={data => data.data}
				/>
			</div>
		);
	}
}

export default translate()(SalariesByOccupation);
