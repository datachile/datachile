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
    const {
      t,
      saveDataset,
      loadDataset,
      datasetsQty = 0,
      mapLevel,
      indicator,
      results
    } = this.props;
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
        {results.queries.regiones && (
          <a
            className={`option`}
            onClick={evt => {
              saveDataset(
                "Exports regional",
                results.queries.regiones.data,
                results.queries.regiones.query,
                "regiones",
                indicator
              );
              saveDataset(
                "Exports comunal",
                results.queries.comunas.data,
                results.queries.comunas.query,
                "comunas",
                indicator
              );
            }}
          >
            {t("Save data")}
          </a>
        )}
        <a
          className={`option fake`}
          onClick={evt =>
            loadDataset(
              "http-query-string-regiones-exports",
              data_map_test_options_region,
              "http-query-string-query-comunas-exports",
              data_map_test_options_comuna
            )
          }
        >
          {t("FAKE load data exports (regiones & comunas)")}
        </a>
        <a
          className={`option fake`}
          onClick={evt =>
            loadDataset(
              "http-query-string-regiones-imports",
              data_map_test_options_region_cif,
              false,
              false
            )
          }
        >
          {t("FAKE load data imports (regiones only)")}
        </a>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  saveDataset(title, dataset, query, level, indicator) {
    dispatch({
      type: "MAP_SAVE_DATASET",
      dataset: {
        title: title,
        query: query,
        data: dataset,
        level: level,
        indicator: indicator
      }
    });
  },
  loadDataset(
    regionesQuery,
    regionesData,
    comunasQuery = false,
    comunasData = false
  ) {
    dispatch({
      type: "MAP_NEW_RESULTS",
      results: {
        regiones: {
          query: regionesQuery,
          data: regionesData
        },
        comunas: comunasQuery
          ? {
              query: comunasQuery,
              data: comunasData
            }
          : false
      }
    });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    datasetsQty: state.map.datasets.list.length,
    mapLevel: state.map.level.value,
    results: state.map.results,
    indicator: "FOB US"
  };
};

MapOptions = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapOptions)
);

export default MapOptions;
export { MapOptions };
