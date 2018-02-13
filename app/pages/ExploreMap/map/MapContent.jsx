import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Geomap } from "d3plus-react";
import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { MAP_SCALE_COLORS } from "helpers/colors";

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
    const { t, i18n, topic, msrName, mapLevel } = this.props;

    const locale = i18n.language;

    const { data_map_test_comuna, data_map_test_region } = this.props.data;

    const configBase = {
      height: 700,
      padding: 3,
      tiles: false,
      fitKey: "id",
      ocean: "#d8d8d8",
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
        color: MAP_SCALE_COLORS[topic],
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
        title: mapLevel == "comunas" ? d => d["Comuna"] : d => d["Region"],
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

    const config = Object.assign({}, configBase, configVariations[mapLevel]);

    return (
      <div className="map-content">
        <div className="map-color-scale" />
        {data_map_test_comuna &&
          data_map_test_region && <Geomap config={config} />}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    topic: state.map.topic.value,
    msrName: "FOB US",
    mapLevel: state.map.level.value
  };
};

MapContent = translate()(connect(mapStateToProps)(MapContent));

export default MapContent;
export { MapContent };
