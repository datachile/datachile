import React from "react";
import { Section } from "@datawheel/canon-core";
import { BarChart } from "d3plus-react";
import { mean } from "d3-array";
import { withNamespaces } from "react-i18next";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { COLORS_SURVEY_RESPONSE } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceTooltip from "components/SourceTooltip";
import ExportLink from "components/ExportLink";

class InternetAccessByZone extends Section {
	static need = [
		(params, store) => {
			var geo = getGeoObject(params);
			const prm = mondrianClient.cube("internet_access").then(cube => {
				//force to region query on comuna profile
				if (geo.type == "comuna") {
					geo = geo.ancestor;
				}
				var q = geoCut(
					geo,
					"Geography",
					cube.query
						.drilldown("Zone", "Zone", "Zone")
						.drilldown(
							"Home Access",
							"Binary Survey Response",
							"Binary Survey Response"
						)
						.measure("Expansion factor"),
					store.i18n.locale
				);

				return {
					key: "path_internet_access",
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
		const path = this.context.data.path_internet_access;

		const locale = i18n.language;
		const geo = this.context.data.geo;

		const geoChartName =
			geo.type == "comuna" ? geo.ancestors[0].caption : geo.caption;

		const classSvg = "internet-access-by-zone";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>
						{t("Internet Access By Zone in ") + geoChartName}
						<SourceTooltip cube="internet_access" />
					</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				<BarChart
					className={classSvg}
					config={{
						height: 400,
						data: path,
						aggs: {
							["Expansion factor"]: mean
						},
						groupBy: "ID Binary Survey Response",
						label: d => d["ID Binary Survey Response"],
						x: "Zone",
						y: "Expansion factor",
						shapeConfig: {
							fill: d => COLORS_SURVEY_RESPONSE[d["ID Binary Survey Response"]],
							label: false
						},
						xConfig: {
							tickSize: 0,
							title: t("Zone")
						},
						yConfig: {
							barConfig: { "stroke-width": 0 },
							tickSize: 0,
							title: false,
							tickFormat: tick => numeral(tick, locale).format("(0.0a)")
						},
						barPadding: 0,
						groupPadding: 10,
						tooltipConfig: {
							title: d => d["Zone"] + " - " + d["Binary Survey Response"],
							body: d =>
								`${numeral(d["Expansion factor"], locale).format(
									"( 0,0 )"
								)} ${t(" people")}`
						},
						legendConfig: {
							label: false,
							shapeConfig: {
								/*backgroundImage: d =>
                  "/images/legend/survey_response/" +
                  d["ID Binary Survey Response"] +
                  ".png"*/
							}
						}
					}}
					dataFormat={data => {
						return data.data;
					}}
				/>
			</div>
		);
	}
}

export default withNamespaces()(InternetAccessByZone);
