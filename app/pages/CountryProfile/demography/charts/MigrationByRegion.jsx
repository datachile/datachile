import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import TreemapStacked from "components/TreemapStacked";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { regionsColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class MigrationByRegion extends Section {
	static need = [
		(params, store) => {
			const country = getLevelObject(params);
			const prm = mondrianClient.cube("immigration").then(cube => {
				const q = levelCut(
					country,
					"Origin Country",
					"Country",
					cube.query
						.option("parents", true)
						.drilldown("Date", "Year")
						.drilldown("Geography", "Comuna")
						.measure("Number of visas"),
					"Continent",
					"Country",
					store.i18n.locale,
					false
				);

				return {
					key: "path_country_migration_by_region",
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

		const path = this.context.data.path_country_migration_by_region;
		const locale = i18n.language;
		const classSvg = "migration-by-region";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>
						{t("Migration By Region")}
						<SourceTooltip cube="immigration" />
					</span>
					<ExportLink path={path} className={classSvg} />
				</h3>

				<TreemapStacked
					className={classSvg}
					path={path}
					msrName="Number of visas"
					drilldowns={["Region", "Comuna"]}
					config={{
						label: d => d["Comuna"],
						total: d => d["Number of visas"],
						totalConfig: {
							text: d =>
								"Total: " +
								numeral(getNumberFromTotalString(d.text), locale).format(
									"0,0"
								) +
								" " +
								t("visas")
						},
						shapeConfig: {
							fill: d => regionsColorScale(d["ID Region"])
						},
						legendTooltip: {
							title: d => d["Region"]
						},
						tooltipConfig: {
							title: d => d["Comuna"],
							body: d =>
								numeral(d["Number of visas"], locale).format("( 0,0 )") +
								" " +
								t("visas")
						},
						legendConfig: {
							label: false,
							shapeConfig: {
								backgroundImage: d =>
									"/images/legend/region/" + d["ID Region"] + ".png"
							}
						},
						yConfig: {
							title: t("Number of visas"),
							tickFormat: tick => numeral(tick, locale).format("0,0")
						}
					}}
				/>
			</div>
		);
	}
}
export default translate()(MigrationByRegion);
