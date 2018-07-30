import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { Treemap } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { regionsColorScale } from "helpers/colors";
import {
	numeral,
	buildPermalink,
	getNumberFromTotalString
} from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

class ImportsByDestination extends Section {
	state = {
		chart: true
	};

	static need = [
		(params, store) => {
			const country = getLevelObject(params);
			const prm = mondrianClient.cube("imports").then(cube => {
				const q = levelCut(
					country,
					"Origin Country",
					"Country",
					cube.query
						.option("parents", true)
						.drilldown("Date", "Year")
						.drilldown("Geography", "Comuna")
						.measure("CIF US"),
					"Continent",
					"Country",
					store.i18n.locale,
					false
				);

				return {
					key: "path_country_imports_by_destination",
					data: __API__ + q.path("jsonrecords")
				};
			});

			return {
				type: "GET_DATA",
				promise: prm
			};
		}
	];

	prepareData = data => {
		if (data.data && data.data.length) {
			return data.data;
		} else {
			this.setState({ chart: false });
		}
	};

	render() {
		const { t, className, i18n, router } = this.props;

		const path = this.context.data.path_country_imports_by_destination;
		const locale = i18n.language;
		const classSvg = "imports-by-destination";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>{t("Imports By Destination")}</span>
					<ExportLink path={path} className={classSvg} />
				</h3>

				{this.state.chart ? (
					<Treemap
						className={classSvg}
						config={{
							height: 400,
							data: path,
							groupBy: ["ID Region", "ID Comuna"],
							label: d => d["Comuna"],
							sum: d => d["CIF US"],
							total: d => d["CIF US"],
							totalConfig: {
								text: d =>
									"Total: US" +
									numeral(
										getNumberFromTotalString(d.text),
										locale
									).format("($ 0.[00] a)") +
									" CIF"
							},
							time: "ID Year",
							shapeConfig: {
								fill: d => regionsColorScale(d["ID Region"])
							},
							on: {
								click: d => {
									var url = buildPermalink(
										d,
										"geo",
										Array.isArray(d.Comuna)
									);
									router.push(url);
								}
							},
							legendTooltip: {
								title: d => d["Region"]
							},
							tooltipConfig: {
								title: d => d["Comuna"],
								body: d =>
									numeral(d["CIF US"], locale).format(
										"(USD 0 a)"
									) +
									" CIF<br/><a>" +
									t("tooltip.to_profile") +
									"</a>"
							},
							legendConfig: {
								label: false,
								shapeConfig: {
									backgroundImage: d =>
										"/images/legend/region/" +
										d["ID Region"] +
										".png"
								}
							}
						}}
						dataFormat={this.prepareData}
					/>
				) : (
					<NoDataAvailable />
				)}
				<SourceNote cube="imports" />
			</div>
		);
	}
}

export default translate()(ImportsByDestination);
