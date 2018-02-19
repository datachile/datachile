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

  getDatasetsQueries() {
    const { datasets = [] } = this.props;
    return [...new Set(datasets.map(ds => ds.data.regiones.query))];
  }

  canSave() {
    const { results, datasets = [] } = this.props;
    if (results.queries.regiones) {
      if (
        this.getDatasetsQueries().indexOf(results.queries.regiones.query) == -1
      ) {
        return true;
      }
    }
    return false;
  }

  render() {
    const {
      t,
      saveDataset,
      loadDataset,
      datasets = [],
      mapLevel,
      indicator,
      results,
      mapTitle
    } = this.props;
    const {
      data_map_test_options_region,
      data_map_test_options_region_cif,
      data_map_test_options_comuna
    } = this.props.data;

    const canSave = this.canSave();

    return (
      <div className="map-options">
        <Link className={`option`} to="/explore/map/data">
          {t("See data")}
          {datasets.length > 0 && <span> ({datasets.length})</span>}
        </Link>
        {results.queries.regiones && (
          <a
            className={`${canSave ? "option" : "option disabled"}`}
            onClick={evt => {
              if (canSave) {
                saveDataset(
                  mapTitle,
                  results.queries,
                  mapLevel,
                  results.queries.regiones.data[0]["FOB US"]
                    ? "FOB US"
                    : "CIF US"
                );
              }
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
    datasets: state.map.datasets.list,
    mapLevel: state.map.level.value,
    results: state.map.results,
    indicator: false,
    mapTitle: state.map.title.text
  };
};

MapOptions = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapOptions)
);

export default MapOptions;
export { MapOptions };
