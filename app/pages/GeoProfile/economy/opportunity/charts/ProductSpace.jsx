import React from "react";

import { Network } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { productsColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { numeral } from "helpers/formatters";
import { sources } from "helpers/consts";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class ProductSpace extends Section {
	static need = [
		simpleGeoChartNeed(
			"path_exports_last_year",
			"exports",
			["FOB US", "Exports RCA"],
			{
				drillDowns: [["Export HS", "HS2"]],
				options: { parents: true, sparse: false, nonempty: false },
				cuts: [`[Date].[Date].[Year].&[${sources.exports.year}]`]
			}
		)
	];

	render() {
		const path = this.context.data.path_exports_last_year;
		const { t, className, i18n } = this.props;

		const locale = i18n.language;
		const classSvg = "product-space";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>
						{t("Product Space")}
						<SourceTooltip cube="exports" />
					</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				<Network
					className={classSvg}
					config={{
						height: 400,
						links: "/json/pspace_hs2012_links_d3p2.json",
						nodes: "/json/pspace_hs2012_nodes_d3p2.json",
						data: path,
						label: d => d.HS2,
						size: "FOB US",
						sizeMin: 3,
						sizeMax: 10,
						zoomScroll: false,
						shapeConfig: {
							Path: {
								stroke: "#555"
							},
							fill: d =>
								d["Exports RCA"] < 1
									? "#888"
									: productsColorScale("hs" + d["ID HS0"]),
							activeStyle: { stroke: "#ffffff" }
						},
						tooltipConfig: {
							body: d => {
								var body = `<table class='tooltip-table'>
                           <tr><td class='title'>${t("Exports")}</td>
                           <td class='data'>US${numeral(
															d["FOB US"],
															locale
														).format("$0, a")}</td></tr>
                           <tr><td class='title'>${t("HS")}</td>
                           <td class='data'>${d["ID HS2"].slice(2)}</td></tr>
                           <tr><td class='title'>${t(
															"RCA"
														)}</td><td class='data'>${numeral(
									d["Exports RCA"],
									locale
								).format("0.0")}</td></tr>
                         </table>`;
								return body;
							}
						},
						legend: false
					}}
					dataFormat={data =>
						data.data.map(d => ({
							...d,
							id: d["ID HS2"].slice(2),
							"Exports RCA": d["Exports RCA"] ? d["Exports RCA"] : 0,
							"FOB US": d["FOB US"] ? d["FOB US"] : 0
						}))
					}
				/>
				<p
					className="chart-text"
					dangerouslySetInnerHTML={{
						__html: t("geo_profile.economy.rca")
					}}
				/>
			</div>
		);
	}
}

export default translate()(ProductSpace);
