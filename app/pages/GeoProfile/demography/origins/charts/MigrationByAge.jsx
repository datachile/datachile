import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import { ordinalColorScale } from "helpers/colors";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";

export default translate()(
	class MigrationByAge extends Section {
		static need = [
			(params, store) => {
				const geo = getGeoObject(params);
				const prm = mondrianClient.cube("immigration").then(cube => {
					var q = geoCut(
						geo,
						"Geography",
						cube.query
							.option("parents", true)
							.drilldown("Date", "Date", "Year")
							.drilldown(
								"Calculated Age Range",
								"Calculated Age Range",
								"Age Range"
							)
							.measure("Number of visas"),
						store.i18n.locale
					);
					return {
						key: "path_migration_by_age",
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
			const path = this.context.data.path_migration_by_age;

			const locale = i18n.language;
			const classSvg = "migration-by-age";

			return (
				<div className={className}>
					<h3 className="chart-title">
						<span>{t("Migration By Age")}</span>
						<ExportLink path={path} className={classSvg} />
					</h3>
					<BarChart
						className={classSvg}
						config={{
							height: 500,
							data: path,
							groupBy: "ID Age Range",
							label: d => d["Age Range"],
							time: "ID Year",
							x: false,
							y: "Number of visas",
							shapeConfig: {
								fill: d => ordinalColorScale(1)
							},
							xConfig: {
								tickSize: 0,
								title: t("Age Range")
							},
							yConfig: {
								title: t("Visas"),
								tickFormat: tick => numeral(tick, locale).format("(0.[0] a)")
							},
							barPadding: 20,
							groupPadding: 40,
							tooltipConfig: {
								title: d => d["Age Range"],
								body: d =>
									numeral(d["Number of visas"], locale).format("( 0,0 )") +
									" " +
									t("visas")
							}
						}}
						dataFormat={data => data.data}
					/>
					<SourceNote cube="immigration" />
				</div>
			);
		}
	}
);
