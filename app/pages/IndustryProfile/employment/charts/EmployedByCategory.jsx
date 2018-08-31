import React from "react";
import { Section } from "datawheel-canon";
import { StackedArea } from "d3plus-react";
import { translate } from "react-i18next";

import { employmentColorScale } from "helpers/colors";

import { numeral } from "helpers/formatters";
import { simpleIndustryChartNeed } from "helpers/MondrianClient";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import NoDataAvailable from "components/NoDataAvailable";

class EmployedByCategory extends Section {
	state = {
		lineplot: true
	};

	static need = [
		simpleIndustryChartNeed(
			"path_industry_employed_by_category",
			"nene_quarter",
			["Expansion factor"],
			{
				drillDowns: [
					["ICSE", "ICSE", "ICSE"],
					["Date", "Date", "Moving Quarter"]
				]
			}
		)
	];

	render() {
		const { t, className, i18n } = this.props;
		const path = this.context.data.path_industry_employed_by_category;

		const locale = i18n.language;
		const classSvg = "employed-by-category";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>
						{t("Employment by Category")}
						<SourceTooltip cube="nene" />
					</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				{this.state.lineplot ? (
					<StackedArea
						className={classSvg}
						config={{
							height: 400,
							data: path,
							groupBy: "variable",
							label: d => d["variable"],
							x: "month",
							y: "percentage",
							time: "month",
							timeline: false,
							scale: "time",
							xConfig: {
								tickSize: 0,
								title: false
							},
							yConfig: {
								title: t("Employment by category"),
								tickFormat: tick => numeral(tick, locale).format("0%")
							},
							shapeConfig: {
								fill: d => employmentColorScale(d["variable"])
							},
							tooltipConfig: {
								title: d => d["variable"],
								body: d => {
									return d["month"] instanceof Array
										? ""
										: numeral(d["percentage"], locale).format("0.[0]%") +
												" " +
												t("people") +
												"<br/>" +
												d["quarter"];
								}
							}
						}}
						dataFormat={data => {
							if (data.data && data.data.length > 0) {
								var melted = [];
								var total = {};
								data.data.forEach(function(f) {
									if (total[f["ID Moving Quarter"]]) {
										total[f["ID Moving Quarter"]] += f["Expansion factor"];
									} else {
										total[f["ID Moving Quarter"]] = f["Expansion factor"];
									}
									var a = f;
									var date = f["ID Moving Quarter"].split("_");
									f["month"] = date[0] + "-" + date[1] + "-01";
									f["quarter"] =
										date[0] +
										" (" +
										date[1] +
										"," +
										date[2] +
										"," +
										date[3] +
										")";
									a["variable"] = f["ICSE"];
									a["value"] = f["Expansion factor"];
									melted.push(a);
								});
								melted = melted
									.map(m => {
										m["percentage"] =
											m["value"] / total[m["ID Moving Quarter"]];
										return m;
									})
									.sort(function(a, b) {
										return a["Month"] > b["Month"] ? 1 : -1;
									});
								return melted;
							} else {
								this.setState({ lineplot: false });
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

export default translate()(EmployedByCategory);
