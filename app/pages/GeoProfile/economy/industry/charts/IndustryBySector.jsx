import React from "react";

import { Treemap } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import {
	numeral,
	getNumberFromTotalString,
	slugifyItem
} from "helpers/formatters";
import { industriesColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class IndustryBySector extends Section {
	static need = [
		simpleGeoChartNeed(
			"path_industry_output",
			"tax_data",
			["Output", "Investment"],
			{
				drillDowns: [["ISICrev4", "Level 4"], ["Date", "Date", "Year"]],
				options: { parents: true }
			}
		)
	];

	render() {
		const path = this.context.data.path_industry_output;
		const { t, className, i18n, router } = this.props;
		const locale = i18n.language;
		const classSvg = "industry-by-sector";
		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>{t("Industry By Output (CLP)")}</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				<Treemap
					className={classSvg}
					config={{
						height: 400,
						data: path,
						groupBy: ["ID Level 1", "ID Level 4"],
						label: d =>
							d["Level 4"] instanceof Array
								? d["Level 1"]
								: d["Level 4"],
						sum: d => d["Output"],
						total: d => d["Output"],
						totalConfig: {
							text: d =>
								"Total: " +
								numeral(
									getNumberFromTotalString(d.text),
									locale
								).format("($ 0.[0] a)")
						},
						time: "ID Year",
						shapeConfig: {
							fill: d => industriesColorScale(d["ID Level 1"])
						},
						legendConfig: {
							label: false,
							shapeConfig: {
								fill: d => industriesColorScale(d["ID Level 1"])
							}
						},
						on: {
							click: d => {
								var url = slugifyItem(
									"industries",
									d["ID Level 1"],
									d["Level 1"],
									d["ID Level 4"] instanceof Array
										? false
										: d["ID Level 2"],
									d["Level 4"] instanceof Array
										? false
										: d["Level 2"]
								);
								router.push(url);
							}
						},
						tooltipConfig: {
							title: d =>
								d["Level 4"] instanceof Array
									? d["Level 1"]
									: d["Level 4"],
							body: d => {
								var body = "<table class='tooltip-table'>";
								body +=
									"<tr><td class='title'>" +
									t("Output") +
									"</td><td class='data'>" +
									numeral(d["Output"], locale).format(
										"($ 0,0.[0] a)"
									) +
									"</td></tr>";
								body +=
									"<tr><td class='title'>" +
									t("Investment") +
									"</td><td class='data'>" +
									numeral(d["Investment"], locale).format(
										"($ 0,0.[0] a)"
									) +
									"</td></tr>";
								body += "</table>";
								if (!(d["Level 4"] instanceof Array))
									body +=
										"<a>" +
										t("tooltip.to_profile") +
										"</a>";
								return body;
							}
						}
					}}
					dataFormat={data => data.data}
				/>
				<SourceNote cube="tax_data" />
			</div>
		);
	}
}

export default translate()(IndustryBySector);
