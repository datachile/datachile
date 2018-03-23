import React from "react";
import { translate } from "react-i18next";

import { Treemap } from "d3plus-react";
import { Section } from "datawheel-canon";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";

import { employmentColorScale } from "helpers/colors";
import { getGeoObject } from "helpers/dataUtils";
import { numeral, getNumberFromTotalString } from "helpers/formatters";
import mondrianClient, { geoCut } from "helpers/MondrianClient";

import ExportLink from "components/ExportLink";
// import MiniFilter from "components/MiniFilter";
import SourceNote from "components/SourceNote";

class MigrationByActivity extends Section {
	// state = {
	//   filter_sex: 2147483647,
	//   filter_age: 2147483647
	// };

	static need = [
		(params, store) => {
			const geo = getGeoObject(params);
			const promise = mondrianClient.cube("immigration").then(cube => {
				var q = cube.query
					.option("parents", false)
					.drilldown("Date", "Date", "Year")
					// .drilldown("Sex", "Sex", "Sex")
					// .drilldown(
					//   "Calculated Age Range",
					//   "Calculated Age Range",
					//   "Age Range"
					// )
					.drilldown("Activity", "Activity", "Activity")
					.measure("Number of visas");

				// return mondrianClient.query(
				//   geoCut(geo, "Geography", q, store.i18n.locale),
				//   "jsonrecords"
				// );
				return {
					key: "path_migration_by_activity",
					data:
						__API__ +
						geoCut(geo, "Geography", q, store.i18n.locale).path("jsonrecords")
				};
			});
			// .then(res => {
			//   return {
			//     key: "chart_migration_by_activity",
			//     data: {
			//       path: res.url.replace("aggregate", "aggregate.jsonrecords"),
			//       raw: res.data.data,
			//       age_ranges: Object.keys(groupBy(res.data.data, "Age Range")).sort(
			//         (a, b) => parseInt(a.split("-")[0]) - parseInt(b.split("-")[0])
			//       )
			//     }
			//   };
			// });

			return { type: "GET_DATA", promise };
		}
	];

	// toggleFilter = (key, flag) => {
	//   this.setState(prevState => ({ [key]: prevState[key] ^ flag }));
	// };

	render() {
		const { t, className, i18n } = this.props;
		// const { filter_sex, filter_age } = this.state;
		const locale = i18n.language;

		const chart_path = this.context.data.path_migration_by_activity;

		// const chart_data = this.context.data.chart_migration_by_activity;

		// const flags_ageranges = {};

		// const filters = [
		//   {
		//     name: t("Gender"),
		//     key: "filter_sex",
		//     value: filter_sex,
		//     items: [{ label: t("Female"), flag: 1 }, { label: t("Male"), flag: 2 }]
		//   },
		//   {
		//     name: t("Age"),
		//     key: "filter_age",
		//     value: filter_age,
		//     items: chart_data.age_ranges.map((range, i) => {
		//       flags_ageranges[range] = Math.pow(2, i);
		//       return { label: range, flag: Math.pow(2, i) };
		//     })
		//   }
		// ];

		const classSvg = "migration-by-activity";

		return (
			<div className={className}>
				<h3 className="chart-title">
					<span>{t("Migration By Activity")}</span>
					<ExportLink path={chart_path} className={classSvg} />
				</h3>
				{/* <MiniFilter onClick={this.toggleFilter} filters={filters} /> */}
				<Treemap
					className={classSvg}
					config={{
						height: 500,
						data: chart_path,
						groupBy: ["ID Activity"],
						label: d => d["Activity"],
						time: "ID Year",
						sum: d => d["Number of visas"],
						total: d => d["Number of visas"],
						totalConfig: {
							text: d =>
								"Total: " +
								numeral(getNumberFromTotalString(d.text), locale).format(
									"(0,0)"
								) +
								" " +
								"visas"
						},
						shapeConfig: {
							fill: d => employmentColorScale(d["ID Activity"])
						},
						tooltipConfig: {
							title: d => d["Activity"],
							body: d =>
								t("{{number}} visas", {
									number: numeral(d["Number of visas"], locale).format(
										"( 0,0 )"
									)
								})
						},
						legend: false,
						legendConfig: {
							label: false,
							shapeConfig: false
						}
					}}
					dataFormat={data => {
						// const filtered = data.filter(d => {
						//   const age_range = flags_ageranges[d["Age Range"]];
						//   return (
						//     d["Number of visas"] > 0 &&
						//     (filter_sex & d["ID Sex"]) == d["ID Sex"] &&
						//     (filter_age & age_range) == age_range
						//   );
						// });
						const filtered = data.data.filter(d => d["Number of visas"] > 0);
						return orderBy(filtered, ["Number of visas"], ["desc"]);
					}}
				/>
				<SourceNote cube="immigration" />
			</div>
		);
	}
}

export default translate()(MigrationByActivity);
