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
      const prm = mondrianClient.cube("exports").then(cube => {
        var q = setLangCaptions(
          cube.query
            .option("parents", true)
            .drilldown("Geography", "Geography", "Region")
            .drilldown("Date", "Date", "Year")
            .measure("FOB US"),
          store.i18n.locale
        );
        return {
          key: "path_map_test_region",
          data: __API__ + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const prm = mondrianClient.cube("exports").then(cube => {
        var q = setLangCaptions(
          cube.query
            .option("parents", true)
            .drilldown("Geography", "Geography", "Comuna")
            .drilldown("Date", "Date", "Year")
            .measure("FOB US"),
          store.i18n.locale
        );
        return {
          key: "path_map_test_comuna",
          data: __API__ + q.path("jsonrecords")
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

  render() {
    const { t, i18n } = this.props;

    const locale = i18n.language;

    const { path_map_test_comuna, path_map_test_region } = this.props.data;

    const mapType = this.state.map_level;
    const msrName = this.state.msrName;

    const configBase = {
      height: 500,
      padding: 3,
      tiles: false,
      fitKey: "id",
      ocean: "#D8D8D8",
      shapeConfig: {
        Path: {
          //fill: d => "#0F0F0F"
          stroke: "#fff"
        }
      },
      label: d => d["Region"],
      tooltipConfig: {
        title: d => {
          return d["Region"];
        },
        body: d => {
          return numeral(d[msrName], locale).format("(USD 0 a)");
        }
      },

      sum: d => d.variable,

      colorScale: "variable",
      colorScalePosition: "bottom",
      colorScaleConfig: {
        color: ['#708bbb','#697db6','#616db1','#5a5fac','#5151a6','#4743a1','#3c349b','#302596','#1f1590','#00008b'],
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
        align: "start",
        downloadButton: false
      },
      time: "ID Year",
      zoom: true
    };

    const configVariations = {
      comunas: {
        id: "ID Comuna",
        topojson: "/geo/comunas.json",
        topojsonId: "id",
        topojsonKey: "comunas_datachile_final",
        data: [],
        groupBy: "ID Comuna"
      },
      regiones: {
        id: "ID Region",
        topojson: "/geo/regiones.json",
        topojsonId: "id",
        topojsonKey: "regiones",
        data: path_map_test_region,
        groupBy: "ID Region"
      }
    };

    const config = Object.assign({}, configBase, configVariations[mapType]);

    return (
      <div className="map-content">
        {this.menuChart(mapType)}
        <Geomap
          config={config}
          dataFormat={data => {
            console.log("data!", data);
            var dataMap = [];
            if (data.data) {
              var dataMap = data.data.map(item => {
                return { ...item, variable: item[msrName] };
              });
            }

            return dataMap;
          }}
        />
      </div>
    );
  }
}

MapContent = translate()(connect(state => ({}))(MapContent));

export default MapContent;
export { MapContent };
