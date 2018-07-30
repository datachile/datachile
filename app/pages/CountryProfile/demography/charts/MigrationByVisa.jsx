import React from "react";
import { translate } from "react-i18next";
import { Treemap } from "d3plus-react";
import { Section } from "datawheel-canon";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

class MigrationByVisa extends Section {
	state = {
		chart: true
	};

	static need = [
		(params, store) => {
			const country = getLevelObject(params);
			const prm = mondrianClient.cube("immigration").then(cube => {
				const q = levelCut(
					country,
					"Origin Country",
					"Country",
					cube.query
						.option("parents", true)
						.drilldown("Date", "Year")
						.drilldown("Visa Type", "Visa Type")
						.measure("Number of visas"),
					"Continent",
					"Country",
					store.i18n.locale,
					false
				);

				return {
					key: "path_country_migration_by_visa",
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
		const filtered = []
			.concat(data.data)
			.filter(o => o && o["Number of visas"] > 0);

		if (filtered && filtered.length) {
			return orderBy(filtered, ["Number of visas"], ["asc"]);
		} else {
			this.setState({ chart: false });
		}
	};

	render() {
		const { t, className, i18n } = this.props;

		const path = this.context.data.path_country_migration_by_visa;
		const locale = i18n.language;
		const classSvg = "migration-by-visa";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>{t("Migration By Visa")}</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				{this.state.chart ? (
					<Treemap
						className={classSvg}
						config={{
							height: 400,
							data: path,
							groupBy: "ID Visa Type",
							label: d => d["Visa Type"],
							sum: d => d["Number of visas"],
							time: "ID Year",
							total: d => d["Number of visas"],
							totalConfig: {
								text: d =>
									"Total: " +
									numeral(getNumberFromTotalString(d.text), locale).format(
										"0,0"
									) +
									" " +
									t("visas")
							},
							shapeConfig: {
								fill: d => ordinalColorScale(d["ID Visa Type"])
							},
							tooltipConfig: {
								title: d => d["Visa Type"],
								body: d =>
									numeral(d["Number of visas"], locale).format("( 0,0 )") +
									" " +
									t("visas")
							},
							legendConfig: {
								label: false,
								shapeConfig: false
							}
						}}
						dataFormat={this.prepareData}
					/>
				) : (
					<NoDataAvailable />
				)}
				<SourceNote cube="immigration" />
			</div>
		);
	}
}

export default translate()(MigrationByVisa);
