import React from "react";
import { Section } from "@datawheel/canon-core";
import TreemapStacked from "components/TreemapStacked";
import { translate } from "react-i18next";

import { continentColorScale } from "helpers/colors";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import {
	numeral,
	getNumberFromTotalString,
	slugifyItem
} from "helpers/formatters";

import SourceTooltip from "components/SourceTooltip";
import ExportLink from "components/ExportLink";

export default translate()(
	class MigrationByOrigin extends Section {
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
							.drilldown("Origin Country", "Country", "Country")
							.measure("Number of visas"),
						store.i18n.locale
					);
					return {
						key: "path_migration_by_origin",
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
			const { t, className, i18n, router } = this.props;
			const path = this.context.data.path_migration_by_origin;

			const locale = i18n.language;
			const classSvg = "migration-by-origin";

			return (
				<div className={className}>
					<h3 className="chart-title">
						<span>
							{t("Migration By Origin")}
							<SourceTooltip cube="immigration" />
						</span>
						<ExportLink path={path} className={classSvg} />
					</h3>
					<TreemapStacked
						className={classSvg}
						path={path}
						msrName="Number of visas"
						drilldowns={["Continent", "Country"]}
						depth={true}
						config={{
							label: d => {
								d["Country"] =
									d["Country"] == "Chile"
										? ["Chile"]
										: d["Country"];
								return d["Country"] instanceof Array
									? d["Continent"]
									: d["Country"];
							},
							total: d => d["Number of visas"],
							totalConfig: {
								text: d =>
									"Total: " +
									numeral(
										getNumberFromTotalString(d.text),
										locale
									).format("0,0") +
									" " +
									t("visas")
							},
							shapeConfig: {
								fill: d =>
									continentColorScale(d["ID Continent"])
							},
							on: {
								click: d => {
									if (!(d["ID Country"] instanceof Array)) {
										var url = slugifyItem(
											"countries",
											d["ID Continent"],
											d["Continent"],
											d["ID Country"] instanceof Array
												? false
												: d["ID Country"],
											d["Country"] instanceof Array
												? false
												: d["Country"]
										);
										router.push(url);
									}
								}
							},
							tooltipConfig: {
								title: d => {
									d["Country"] =
										d["Country"] == "Chile"
											? ["Chile"]
											: d["Country"];
									return d["Country"] instanceof Array
										? d["Continent"]
										: d["Country"];
								},
								body: d => {
									const link =
										d["ID Country"] instanceof Array
											? ""
											: "<br/><a>" +
											  t("tooltip.to_profile") +
											  "</a>";
									return (
										numeral(
											d["Number of visas"],
											locale
										).format("(0a)") +
										" " +
										t("people") +
										link
									);
								}
							},
							legendConfig: {
								label: d => d["Continent"],
								shapeConfig: {
									backgroundImage: d =>
										"/images/legend/continent/" +
										d["ID Continent"] +
										".png"
								}
							},
							yConfig: {
								title: t("Number of visas"),
								tickFormat: tick =>
									numeral(tick, locale).format("0,0")
							}
						}}
					/>
				</div>
			);
		}
	}
);
