import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import { RDTypesColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import TreemapStacked from "components/TreemapStacked";

class RDByBusinessType extends Section {
	static need = [
		(params, store) => {
			var industry = getLevelObject(params);
			industry.level2 = false;
			const prm = mondrianClient.cube("rd_survey").then(cube => {
				var q = levelCut(
					industry,
					"ISICrev4",
					"ISICrev4",
					cube.query
						.option("parents", true)
						.drilldown("Business Type", "Business Type", "Business Type")
						.drilldown("Date", "Date", "Year")
						.measure("Total Spending"),
					"Level 1",
					"Level 2",
					store.i18n.locale
				);

				return {
					key: "industry_rd_by_business_type",
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
		const path = this.context.data.industry_rd_by_business_type;
		const industry = this.context.data.industry;

		const locale = i18n.language;
		const classSvg = "rd-spending-by-business-type";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>
						{t("Total R&D spending by Business Type")}
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
					msrName="Total Spending"
					drilldowns={["Business Type", "Business Type"]}
					config={{
						label: d => d["Business Type"],
						total: d => d["Total Spending"],
						totalConfig: {
							text: d =>
								"Total: US" +
								numeral(getNumberFromTotalString(d.text), locale).format(
									"($ 0.[00] a)"
								)
						},
						shapeConfig: {
							fill: d => RDTypesColorScale("r" + d["ID Business Type"])
						},
						tooltipConfig: {
							title: d => d["Business Type"],
							body: d =>
								numeral(d["Total Spending"], locale).format("(USD 0 a)")
						},
						legendConfig: {
							shapeConfig: {
								width: 20,
								height: 20
							}
						},
						yConfig: {
							title: t("US$"),
							tickFormat: tick => numeral(tick, locale).format("(0 a)")
						}
					}}
				/>

				<SourceNote cube="rd_survey" />
			</div>
		);
	}
}

export default translate()(RDByBusinessType);
