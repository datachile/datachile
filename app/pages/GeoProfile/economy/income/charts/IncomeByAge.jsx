import React from "react";
import { Section } from "@datawheel/canon-core";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { incomeByAgeColorScale } from "helpers/colors";
import { numeral, moneyRangeFormat } from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import NoDataAvailable from "components/NoDataAvailable";

class IncomeByAge extends Section {
	state = {
		show: true
	};

	static need = [
		(params, store) => {
			let geo = getGeoObject(params);
			//force to region query on comuna profile
			if (geo.type === "comuna") {
				geo = geo.ancestor;
			}
			return simpleGeoChartNeed(
				"path_income_by_age",
				"nesi_income",
				["Expansion Factor"],
				{
					drillDowns: [
						["Date", "Date", "Year"],
						["Income Range", "Income Range", "Income Range"],
						["Age Range", "Age Range", "Age Range"]
					],
					options: { parents: true }
				},
				geo
			)(params, store);
		}
	];

	render() {
		const path = this.context.data.path_income_by_age;
		const { t, className, i18n } = this.props;

		const locale = i18n.language;
		const classSvg = "income-by-age";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>
						{t("Income By Age")}
						<SourceTooltip cube="nesi_income" />
					</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				{this.state.show ? (
					<BarChart
						className={classSvg}
						config={{
							height: 400,
							data: path,
							groupBy: "ID Age Range",
							label: d => d["Age Range"],
							time: "ID Year",
							x: "Income Range",
							y: "Expansion Factor",
							shapeConfig: {
								fill: d => incomeByAgeColorScale("by_age" + d["ID Age Range"]),
								label: false
							},
							xConfig: {
								tickSize: 0,
								title: t("Income Range CLP"),
								tickFormat: tick => moneyRangeFormat(tick, locale)
							},
							xSort: (a, b) =>
								a["ID Income Range"] > b["ID Income Range"] ? 1 : -1,
							yConfig: {
								title: t("People"),
								tickFormat: tick => numeral(tick, locale).format("(0.[0]a)")
							},
							barPadding: 0,
							groupPadding: 5,
							tooltipConfig: {
								title: d => {
									var title = d["Age Range"];
									title +=
										d["Income Range"] instanceof Array
											? ""
											: ": " + moneyRangeFormat(d["Income Range"], locale);
									return title;
								},
								body: d =>
									numeral(d["Expansion Factor"], locale).format("(0.[0]a)") +
									" " +
									t("people")
							},
							legendConfig: {
								label: false,
								shapeConfig: {
									backgroundImage: () => "/images/legend/occupation/person.png"
								}
							}
						}}
						dataFormat={data => {
							if (data.data && data.data.length > 0) {
								return data.data;
							} else {
								this.setState({ show: false });
							}
						}}
					/>
				) : (
					<NoDataAvailable />
				)}
			</div>
		);
	}
}

export default translate()(IncomeByAge);
