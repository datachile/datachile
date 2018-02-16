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
    },
    (params, store) => {
      const prm = mondrianClient
        .cube("exports")
        .then(cube => {
          var q = setLangCaptions(
            cube.query
              .option("parents", false)
              .drilldown("Geography", "Geography", "Comuna")
              .drilldown("Date", "Date", "Year")
              .measure("FOB US"),
            store.i18n.locale
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "data_map_test_options_comuna",
            data: res.data.data
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const prm = mondrianClient
        .cube("imports")
        .then(cube => {
          var q = setLangCaptions(
            cube.query
              .option("parents", false)
              .drilldown("Geography", "Geography", "Region")
              .drilldown("Date", "Date", "Year")
              .measure("CIF US"),
            store.i18n.locale
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "data_map_test_options_region_cif",
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
    const {
      data_map_test_options_region,
      data_map_test_options_region_cif,
      data_map_test_options_comuna
    } = this.props.data;

    return (
      <div className="map-options">
        <Link className={`option`} to="/explore/map/data">
          {t("See data")}
          {datasetsQty > 0 && <span> ({datasetsQty})</span>}
        </Link>
        <a
          className={`option`}
          onClick={evt =>
            saveDataset(
              "Exports",
              data_map_test_options_region,
              "regiones",
              indicator
            )
          }
        >
          {t("Save data regional Exports")}
        </a>
        <a
          className={`option`}
          onClick={evt =>
            saveDataset(
              "Exports",
              data_map_test_options_comuna,
              "comunas",
              indicator
            )
          }
        >
          {t("Save data comunal Exports")}
        </a>
        <a
          className={`option`}
          onClick={evt =>
            saveDataset(
              "Imports",
              data_map_test_options_region_cif,
              "regiones",
              "CIF US"
            )
          }
        >
          {t("Save data regional Imports")}
        </a>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  saveDataset(title, dataset, level, indicator) {
    dispatch({
      type: "MAP_SAVE_DATASET",
      dataset: {
        title: title,
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
