import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import ReactTable from "react-table";
import { combineAndFlatDatasets } from "helpers/map";

import "../../../../node_modules/react-table/react-table.css";

import NoDataAvailable from "components/NoDataAvailable";

import "./DataContent.css";

class DataContent extends Component {
	render() {
		const { t, datasets = [], pivotType } = this.props;

		if (datasets.length == 0) {
			return (
				<div className="data-content">
					<p>
						<NoDataAvailable message={t("No datasets selected")} icon="empty-cart"/>
					</p>
				</div>
			);
		}

		const flattenedData = combineAndFlatDatasets(datasets, pivotType);

		const columns = flattenedData.fields.map(h => ({
			Header:
				h.split("_").length > 1
					? h
							.split("_")
							.splice(1)
							.join(" ")
					: h,
			accessor: h,
			width: 180
		}));

		return (
			<div className="data-content">
				<ReactTable
					className="table"
					data={flattenedData.dataset}
					columns={columns}
					pageSizeOptions={[20, 25, 50, 100]}
					defaultPageSize={
						flattenedData.dataset.length < 20
							? flattenedData.dataset.length
							: 20
					}
					style={
						{
							//height: "00px" // This will force the table body to overflow and scroll, since there is not enough room
						}
					}
					previousText={t("table.prev")}
					nextText={t("table.next")}
					loadingText={t("table.loading")}
					noDataText={t("table.no_data")}
					pageText={t("table.page")}
					ofText={t("table.of")}
					rowsText={t("table.rows")}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		datasets: state.map.datasets,
		pivotType: state.map.pivot
	};
};

DataContent = translate()(connect(state => mapStateToProps)(DataContent));

export default DataContent;
export { DataContent };
