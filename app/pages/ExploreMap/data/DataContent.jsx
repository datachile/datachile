import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import ReactTable from "react-table";
import { combineAndFlatDatasets } from "helpers/map";

import "../../../../node_modules/react-table/react-table.css";

import "./DataContent.css";

class DataContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t, datasets = [] } = this.props;

    if (datasets.length == 0) {
      return (
        <p>
          no data <Link to="/explore/map">Go to mapa</Link>
        </p>
      );
    }

    const flattenedData = combineAndFlatDatasets(datasets);

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
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    datasets: state.map.datasets
  };
};

DataContent = translate()(connect(state => mapStateToProps)(DataContent));

export default DataContent;
export { DataContent };
