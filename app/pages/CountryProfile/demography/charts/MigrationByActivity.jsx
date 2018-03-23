import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { Treemap } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

class MigrationByActivity extends Section {
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
						.drilldown("Activity", "Activity")
						.measure("Number of visas"),
					"Continent",
					"Country",
					store.i18n.locale,
					false
				);

				return {
					key: "path_country_migration_by_activity",
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
		const { t, className, i18n } = this.props;

		const locale = i18n.language;

		const path = this.context.data.path_country_migration_by_activity;
		const classSvg = "migration-by-activity";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>{t("Migration By Activity")}</span>
					<ExportLink path={path} className={classSvg} />
				</h3>
				{this.state.chart ? (
					<Treemap
						className={classSvg}
						config={{
							height: 500,
							data: path,
							groupBy: "ID Activity",
							label: d => d["Activity"],
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
								fill: d => ordinalColorScale(d["ID Activity"])
							},
							tooltipConfig: {
								title: d => d["Activity"],
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

export default translate()(MigrationByActivity);
