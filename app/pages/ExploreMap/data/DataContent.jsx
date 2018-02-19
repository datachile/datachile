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

  flatDataset(dataset) {
    const indicatorSlug = slugifyStr(dataset.indicator, "_");
    const region = dataset.level == "regiones";

    var localFlattenedFields = {};

    return {
      data: nest()
        .key(function(d) {
          return region ? d["ID Region"] : d["ID Comuna"];
        })
        .rollup(function(leaves) {
          return leaves.reduce((record, param) => {
            const field = indicatorSlug + "_" + param["ID Year"];
            localFlattenedFields[field] = true;
            record.entity = region ? param["Region"] : param["Comuna"];
            record.entity_id = region ? param["ID Region"] : param["ID Comuna"];
            record.type = region ? "region" : "comuna";
            record[field] = param[dataset.indicator];
            return record;
          }, {});
        })
        .entries(dataset.data)
        .map(d => d.value),
      fields: localFlattenedFields
    };
  }

  combineAndFlatDatasets(datasets) {
    var flattenedDatasets = [];

    var flattenedFields = { type: true, entity: true, entity_id: true };

    datasets.forEach(dataset => {
      const { data, fields } = this.flatDataset(dataset);
      flattenedFields = Object.assign(flattenedFields, fields);
      flattenedDatasets = flattenedDatasets.concat(data);
    });

    flattenedDatasets = nest()
      .key(function(d) {
        return d["type"] + "_" + d["entity_id"];
      })
      .rollup(function(leaves) {
        return leaves.reduce((obj, param) => {
          return Object.assign(obj, param);
        }, {});
      })
      .entries(flattenedDatasets)
      .map(d => d.value);

    return { dataset: flattenedDatasets, fields: Object.keys(flattenedFields) };
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

    const flattenedData = this.combineAndFlatDatasets(datasets);

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
    datasets: state.map.datasets.list
  };
};

DataContent = translate()(connect(state => mapStateToProps)(DataContent));

export default DataContent;
export { DataContent };
