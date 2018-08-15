import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import {
	numeral,
	buildPermalink,
	getNumberFromTotalString
} from "helpers/formatters";
import { productsColorScale } from "helpers/colors";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

class ImportsByProduct extends Section {
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
						.drilldown("Import HS", "HS", "HS2")
						.drilldown("Date", "Year")
						.measure("CIF US"),
					"Continent",
					"Country",
					store.i18n.locale,
					false
				);

				return {
					key: "path_imports_by_product_country",
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

		const locale = i18n.language;
		const path = this.context.data.path_imports_by_product_country;
		const classSvg = "imports-by-product";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>{t("Imports by product")}</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				{this.state.chart ? (
					<Treemap
						className={classSvg}
						config={{
							height: 400,
							data: path,
							groupBy: ["ID HS0", "ID HS2"],
							label: d =>
								d["HS2"] instanceof Array ? d["HS0"] : d["HS2"],
							sum: d => d["CIF US"],
							total: d => d["CIF US"],
							totalConfig: {
								text: d =>
									"Total: US " +
									numeral(
										getNumberFromTotalString(d.text),
										locale
									).format("($0.[00]a)") +
									" CIF"
							},
							time: "ID Year",
							legendConfig: {
								label: false,
								shapeConfig: {
									fill: d =>
										productsColorScale("hs" + d["ID HS0"]),
									backgroundImage: d =>
										"/images/legend/hs/hs_" +
										d["ID HS0"] +
										".png"
								}
							},
							shapeConfig: {
								fill: d =>
									productsColorScale("hs" + d["ID HS0"])
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
							tooltipConfig: {
								title: d =>
									d["HS2"] instanceof Array
										? d["HS0"]
										: d["HS2"],
								body: d =>
									numeral(d["CIF US"], locale).format(
										"(USD 0a)"
									) +
									" CIF<br/><a>" +
									t("tooltip.to_profile") +
									"</a>"
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

export default translate()(ImportsByProduct);
