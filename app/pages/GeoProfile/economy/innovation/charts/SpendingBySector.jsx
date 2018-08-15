import React from "react";

import { Treemap } from "d3plus-react";
import mondrianClient, {
	setLangCaptions,
	getMeasureByGeo
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class SpendingBySector extends Section {
	static need = [
		(params, store) => {
			const geo = getGeoObject({ region: params.region, comuna: undefined });

			const regionID =
				typeof geo.ancestor != "undefined" ? geo.ancestor.key : "";
			const measureName = getMeasureByGeo(
				geo.type,
				"Total Spending",
				"gasto_region_" + geo.key,
				"gasto_region_" + regionID
			);

			const prm = mondrianClient.cube("rd_survey").then(cube => {
				var q = setLangCaptions(
					cube.query
						.option("parents", true)
						.drilldown("Date", "Date", "Year")
						.drilldown("Ownership Type", "Ownership Type", "Ownership Type")
						.measure(measureName),
					store.i18n.locale
				);

				return {
					key: "path_spending_by_sector",
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
		const path = this.context.data.path_spending_by_sector;
		const { t, className, i18n } = this.props;
		const locale = i18n.language;

		const geo = this.context.data.geo;
		const regionID = geo.type === "comuna" ? geo.ancestors[0].key : "";
		const measureName = getMeasureByGeo(
			geo.type,
			"Total Spending",
			"gasto_region_" + geo.key,
			"gasto_region_" + regionID
    );

    const classSvg = "spending-by-sector";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>
						{t("R&D Spending By Sector")}{" "}
						{geo && geo.type == "comuna" && t("Regional")}
					</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				<Treemap
					className={classSvg}
					config={{
						height: 400,
						data: path,
						groupBy: "ID Ownership Type",
						label: d => d["Ownership Type"],
						sum: d => d[measureName],
						total: d => d[measureName],
						time: "ID Year",
						totalConfig: {
							text: d =>
								"Total: US " +
								numeral(getNumberFromTotalString(d.text), locale).format(
									"($0,.[00] a)"
								)
						},
						shapeConfig: {
							fill: d => ordinalColorScale(d["ID Ownership Type"])
						},
						legend: false,
						legendConfig: {
							label: false,
							shapeConfig: {
								fill: d => ordinalColorScale(d["ID Ownership Type"]),
								backgroundImage: d =>
									"https://datausa.io/static/img/attrs/thing_apple.png"
							}
						}
					}}
					dataFormat={data => data.data}
				/>
				<SourceNote cube="rd_survey" />
			</div>
		);
	}
}

export default translate()(SpendingBySector);
