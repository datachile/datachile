import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Geomap } from "d3plus-react";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

import "./MapContent.css";

class MapContent extends Component {
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
            key: "data_map_test_region",
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
            key: "data_map_test_comuna",
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
    this.state = {
      map_level: "regiones",
      msrName: "FOB US"
    };
  }

  menuChart(selected) {
    const { t } = this.props;
    return (
      <div className="map-switch-options">
        <a
          className={`toggle ${selected === "regiones" ? "selected" : ""}`}
          onClick={evt => this.toggleChart("regiones")}
        >
          {t("Regiones")}
        </a>
        <a
          className={`toggle ${selected === "comunas" ? "selected" : ""}`}
          onClick={evt => this.toggleChart("comunas")}
        >
          {t("Comunas")}
        </a>
      </div>
    );
  }

  toggleChart(level) {
    this.setState({
      map_level: level
    });
  }

  processResults(data, msrName) {
    var dataMap = [];
    if (data) {
      var dataMap = data.map(item => {
        return { ...item, variable: item[msrName] };
      });
    }
    return dataMap;
  }

  render() {
    const { t, i18n } = this.props;

    const locale = i18n.language;

    const mapType = this.state.map_level;
    const msrName = this.state.msrName;

    const { data_map_test_comuna, data_map_test_region } = this.props.data;

    const configBase = {
      height: 700,
      padding: 3,
      tiles: false,
      fitKey: "id",
      ocean: "#D8D8D8",
      shapeConfig: {
        Path: {
          stroke: "#fff"
        }
      },
      label: false,
      sum: d => d.variable,
      colorScale: "variable",
      colorScalePosition: "left",
      colorScaleConfig: {
        color: [
          "#708bbb",
          "#697db6",
          "#616db1",
          "#5a5fac",
          "#5151a6",
          "#4743a1",
          "#3c349b",
          "#302596",
          "#1f1590",
          "#00008b"
        ],
        axisConfig: {
          shapeConfig: {
            labelConfig: {
              fontColor: "#000"
            }
          },
          tickFormat: tick => {
            return numeral(parseFloat(tick), "es").format("($ 0.[00] a)");
          }
        },
        downloadButton: false
      },
      tooltipConfig: {
        title: mapType == "comunas" ? d => d["Comuna"] : d => d["Region"],
        body: d => numeral(d[msrName], locale).format("(USD 0 a)")
      },
      zoom: true
    };

    const configVariations = {
      comunas: {
        id: "ID Comuna",
        topojson: "/geo/comunas.json",
        topojsonId: "id",
        topojsonKey: "comunas_datachile_final",
        groupBy: "ID Comuna",
        data: this.processResults(data_map_test_comuna, msrName),
        label: d => d["Comuna"]
      },
      regiones: {
        id: "ID Region",
        topojson: "/geo/regiones.json",
        topojsonId: "id",
        topojsonKey: "regiones",
        data: this.processResults(data_map_test_region, msrName),
        groupBy: "ID Region",
        label: d => d["Region"]
      }
    };

    const config = Object.assign({}, configBase, configVariations[mapType]);

    return (
      <div className="map-content">
        {this.menuChart(mapType)}
        <div className="map-color-scale" />
        {data_map_test_comuna &&
          data_map_test_region && <Geomap config={config} />}
      </div>
    );
  }
}

MapContent = translate()(connect(state => ({}))(MapContent));

export default MapContent;
export { MapContent };
