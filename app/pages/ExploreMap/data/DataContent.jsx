import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import ReactTable from "react-table";
import { combineAndFlatDatasets } from "helpers/map";

import "../../../../node_modules/react-table/react-table.css";

import "./DataContent.css";

class DataContent extends Component {
  render() {
    const { t, datasets = [], pivotType } = this.props;

    if (datasets.length == 0) {
      return (
        <div className="data-content">
          <p>{t("No datasets selected")}.</p>
        </div>
      );
    }

    const flattenedData = combineAndFlatDatasets(datasets, pivotType);

    const columns = flattenedData.fields.map(h => ({
      Header: h,
      accessor: h,
      width: 200
    }));

    return (
      <div className="data-content">
        <ReactTable
          className="table"
          data={flattenedData.dataset}
          columns={columns}
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
