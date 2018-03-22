import React from "react";
import { Section } from "datawheel-canon";
import { Plot } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { translate } from "react-i18next";

import { sources } from "helpers/consts";
import { administrationColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";
import NoDataAvailable from "components/NoDataAvailable";

class PSUNEMScatter extends Section {
	state = {
		plot: true
	};
	static need = [
		simpleGeoChartNeed(
			"path_education_psu_vs_nem_by_school",
			"education_performance_new",
			["Average PSU", "Average NEM", "Number of records"],
			{
				drillDowns: [["Institution", "Institution", "Institution"]],
				cuts: [
					`[Year].[Year].[Year].&[${sources.education_performance_new.year}]`
				],
				options: { parents: true }
			}
		),
		simpleGeoChartNeed(
			"path_education_psu_vs_nem_by_school_chile",
			"education_performance_new",
			["Average PSU", "Average NEM", "Number of records"],
			{
				drillDowns: [
					["Geography", "Geography", "Comuna"],
					["Institution", "Institution", "Administration"]
				],
				cuts: [
					`[Year].[Year].[Year].&[${sources.education_performance_new.year}]`
				],
				options: { parents: true }
			}
		)
	];

	render() {
		const { t, className, i18n } = this.props;
		const {
			geo,
			path_education_psu_vs_nem_by_school,
			path_education_psu_vs_nem_by_school_chile
		} = this.context.data;

		const national = geo.key == "chile" ? true : false;

		const path =
			geo && national
				? path_education_psu_vs_nem_by_school_chile
				: path_education_psu_vs_nem_by_school;

		const locale = i18n.language;
		const classSvg = "psu-nem-scatter";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>
						{national
							? t("PSU vs NEM by Comuna & Administration")
							: t("PSU vs NEM by school")}
					</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				{this.state.plot ? (
					<Plot
						className={classSvg}
						config={{
							height: 500,
							data: path,
							groupBy: national
								? ["ID Comuna", "ID Administration"]
								: ["ID Institution"],
							label: d => d["Administration"],
							x: "Average NEM",
							y: "Average PSU",
							size: "Number of records",
							colorScalePosition: false,
							shapeConfig: {
								fill: d => {
									if (d["Institution"] !== "hack") {
										return administrationColorScale(
											"education" + d["Administration"]
										);
									} else {
										return "transparent";
									}
								}
							},
							xConfig: {
								title: t("Average NEM")
							},
							x2Config: {
								barConfig: {
									"stroke-width": 0
								}
							},
							yConfig: {
								title: t("Average PSU")
							},
							tooltip: d => {
								if (d["Institution"] === "hack") {
									return "";
								}
							},
							tooltipConfig: {
								title: d => {
									if (d["Institution"] !== "hack") {
										var title = "";
										if (d["ID Institution"]) {
											title =
												d["ID Institution"] instanceof Array
													? d["Administration"]
													: d["Institution"] + " - " + d["Administration"];
										}
										if (d["ID Comuna"]) {
											title =
												d["ID Comuna"] instanceof Array
													? d["Administration"]
													: d["Comuna"] +
													  " (" +
													  d["Region"] +
													  ") - " +
													  d["Administration"];
										}

										return title;
									}
								},
								body: d => {
									if (d["Institution"] !== "hack") {
										var body = "";
										if (
											(d["ID Institution"] &&
												!(d["ID Institution"] instanceof Array)) ||
											(d["ID Comuna"] && !(d["ID Comuna"] instanceof Array))
										) {
											var body = "<table class='tooltip-table'>";
											body +=
												"<tr><td class='title'>" +
												t("Average NEM") +
												"</td><td class='data'>" +
												numeral(d["Average NEM"], locale).format("(0.[0])") +
												"</td></tr>";
											body +=
												"<tr><td class='title'>" +
												t("Average PSU") +
												"</td><td class='data'>" +
												numeral(d["Average PSU"], locale).format("(0)") +
												"</td></tr>";
											body +=
												"<tr><td class='title'>" +
												t("Students") +
												"</td><td class='data'>" +
												numeral(d["Number of records"], locale).format(
													"(0,0)"
												) +
												"</td></tr>";
											body += "</table>";
										}
										return body;
									}
								}
							},
							legendConfig: {
								label: d => {
									if (d["Number of records"] > 0) {
										return d["Administration"];
									} else {
										return false;
									}
								},
								shapeConfig: {
									width: 40,
									height: 40,
									backgroundImage: d => {
										if (d["Number of records"] > 0) {
											return "/images/legend/college/administration.png";
										} else {
											return false;
										}
									}
								}
							}
						}}
						dataFormat={data => {
							const d = data.data.filter(f => {
								return f["Average NEM"] && f["Average PSU"];
							});
							if (d && d.length > 1) {
								return d;
							} else if (d.length === 1) {
								d.push({
									//...d[0],
									"ID Institution": 999999999,
									Institution: "hack",
									"Number of records": 0,
									"Average NEM": d[0]["Average NEM"] + 0.5,
									"Average PSU": d[0]["Average PSU"] + 10
								});
								d.push({
									//...d[0],
									"ID Institution": 999999998,
									Institution: "hack",
									"Number of records": 0,
									"Average NEM": d[0]["Average NEM"] - 0.5,
									"Average PSU": d[0]["Average PSU"] - 10
								});
								return d;
							} else {
								this.setState({ plot: false });
							}
						}}
					/>
				) : (
					<NoDataAvailable />
				)}
				<SourceNote cube="education_performance_new" />
			</div>
		);
	}
}
export default translate()(PSUNEMScatter);
