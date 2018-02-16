import React, { Component } from "react";
import { translate } from "react-i18next";
import { Link } from "react-router";
import { connect } from "react-redux";
import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

import "./MapOptions.css";

class MapOptions extends Component {
  static need = [
    (params, store) => {
      const prm = mondrianClient
        .cube("exports")
        .then(cube => {
          var q = setLangCaptions(
            cube.query
              .option("parents", false)
              .drilldown("Geography", "Geography", "Region")
              .drilldown("Date", "Date", "Year")
              .measure("FOB US"),
            store.i18n.locale
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "data_map_test_options_region",
            data: res.data.data
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  constructor(props) {
    super(props);
  }

  render() {
    const { t, saveDataset, datasetsQty = 0, mapLevel, indicator } = this.props;
    const { data_map_test_options_region } = this.props.data;

    return (
      <div className="map-options">
        <Link className={`option`} to="/explore/map/data">
          {t("See data")}
        </Link>
        <a
          className={`option`}
          onClick={evt =>
            saveDataset(data_map_test_options_region, mapLevel, indicator)
          }
        >
          {t("Save data")}
          {datasetsQty > 0 && <span> ({datasetsQty})</span>}
        </a>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  saveDataset(dataset, level, indicator) {
    dispatch({
      type: "MAP_SAVE_DATASET",
      dataset: {
        title: "dataset peola",
        data: dataset,
        level: level,
        indicator: indicator
      }
    });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    datasetsQty: state.map.datasets.list.length,
    mapLevel: state.map.level.value,
    indicator: "FOB US"
  };
};

MapOptions = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapOptions)
);

export default MapOptions;
export { MapOptions };
