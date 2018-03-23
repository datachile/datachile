import React from "react";
import { Section } from "datawheel-canon";

import { BarChart } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { institutionsColorScale } from "helpers/colors";
import { translate } from "react-i18next";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

export default translate()(
	class PerformanceByType extends Section {
		static need = [
			simpleGeoChartNeed(
				"path_education_performance_by_administration",
				"education_performance_new",
				["Average NEM"],
				{
					drillDowns: [
						["Institution", "Institution", "Administration"],
						["Year", "Year", "Year"]
					],
					options: { parents: true }
				}
			)
		];

		render() {
			const { t, className } = this.props;
			const path = this.context.data
				.path_education_performance_by_administration;

			const classSvg = "performance-by-type";

			return (
				<div className={className}>
					<h3 className="chart-title">
						<span>{t("NEM Performance By Administration")}</span>
						<ExportLink path={path} className={classSvg} />
					</h3>
					<BarChart
						className={classSvg}
						config={{
							height: 500,
							data: path,
							groupBy: ["Administration"],
							//label: d =>
							//  d["Country"] instanceof Array ? d["Region"] : d["Country"],
							sum: d => d["Average NEM"],
							time: "ID Year",
							discrete: "y",
							x: "Average NEM",
							y: "Administration",
							shapeConfig: {
								fill: d =>
									institutionsColorScale("adm" + d["ID Administration"]),
								label: d => d["Administration"]
							},
							xDomain: [1, 7],
							barPadding: 5,
							groupPadding: 5,
							legendConfig: {
								label: false,
								shapeConfig: false
							},
							xConfig: {
								title: t("Average NEM")
							},
							yConfig: {
								width: 0,
								title: t("Administration")
							},
							ySort: (a, b) => {
								return a["Average NEM"] > b["Average NEM"] ? 1 : -1;
							},
							legendConfig: {
								label: d => d["Administration"],
								shapeConfig: {
									width: 40,
									height: 40,
									backgroundImage: d =>
										"/images/legend/college/administration.png"
								}
							}
						}}
						dataFormat={data => data.data}
					/>
					<SourceNote cube="education_performance_new" />
				</div>
			);
		}
	}
);
