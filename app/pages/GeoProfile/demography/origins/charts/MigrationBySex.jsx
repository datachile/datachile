import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { COLORS_GENDER } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";

export default translate()(
	class MigrationBySex extends Section {
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
							.drilldown("Sex", "Sex", "Sex")
							.measure("Number of visas"),
						store.i18n.locale
					);
					return {
						key: "path_migration_by_sex",
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
			const path = this.context.data.path_migration_by_sex;

			const locale = i18n.language;
			const classSvg = "migration-by-sex";

			return (
				<div className={className}>
					<h3 className="chart-title">
						<span>{t("Migration By Sex")}</span>
						<ExportLink path={path} className={classSvg} />
					</h3>
					<BarChart
						className={classSvg}
						config={{
							height: 400,
							data: path,
							//groupBy: "ID Sex",
							label: d => d["Sex"],
							time: "ID Year",
							x: "ID Sex",
							discrete: "x",
							y: "Number of visas",
							shapeConfig: {
								fill: d => COLORS_GENDER[d["ID Sex"]]
							},
							xConfig: {
								tickSize: 0,
								tickFormat: d => " ",
								labelOffset: false,
								title: false
							},
							yConfig: {
								title: t("Visas"),
								tickFormat: tick => numeral(tick, locale).format("(0.[0]a)")
							},
							barPadding: 20,
							groupPadding: 40,
							tooltipConfig: {
								title: d => t(d["Sex"]),
								body: d =>
									numeral(d["Number of visas"], locale).format("( 0,0 )") +
									" " +
									t("visas")
							},
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
					<SourceNote cube="immigration" />
				</div>
			);
		}
	}
);
