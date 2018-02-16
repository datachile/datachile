import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import ReactTable from "react-table";
import "../../../../node_modules/react-table/react-table.css";
import groupBy from "lodash/groupBy";
import { nest } from "d3-collection";
import { slugifyStr } from "helpers/formatters";
import "./DataContent.css";

class DataContent extends Component {
  constructor(props) {
    super(props);
  }

  combineAndPlainDatasets(datasets) {
    var plainedDatasets = [];

    datasets.forEach(dataset => {
      const indicatorSlug = slugifyStr(dataset.indicator, "_");
      var plain = nest()
        .key(function(d) {
          return d["ID Region"];
        })
        .rollup(function(leaves) {
          return leaves.reduce((record, param) => {
            record.type = "region";
            record.entity_id = param["ID Region"];
            record.entity = param["Region"];
            record[indicatorSlug + "_" + param["ID Year"]] =
              param[dataset.indicator];
            return record;
          }, {});
        })
        .entries(dataset.data)
        .map(d => d.value);

      plainedDatasets = plainedDatasets.concat(plain);
    });
    return plainedDatasets;
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

    const plainDataset = this.combineAndPlainDatasets(datasets);

    const headers = Object.keys(plainDataset[0]);

    const columns = headers.map(h => ({
      Header: h,
      accessor: h
    }));

    return (
      <div className="data-content">
        <ReactTable className="table" data={plainDataset} columns={columns} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    datasets: state.map.datasets.list
  };
};

DataContent = translate()(connect(state => mapStateToProps)(DataContent));

export default DataContent;
export { DataContent };
