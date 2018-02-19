import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Geomap } from "d3plus-react";
import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { MAP_SCALE_COLORS } from "helpers/colors";

import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

import "./MapContent.css";

class MapContent extends Component {
  processResults(data, msrName, mapYear) {
    var dataMap = [];
    if (data && msrName && mapYear) {
      var dataMap = data
        .filter(item => {
          return item["Year"] == mapYear;
        })
        .map(item => {
          return { ...item, variable: item[msrName] };
        });
    }
    return dataMap;
  }

  render() {
    const { t, i18n, topic, msrName, mapLevel, mapYear, results } = this.props;

    const locale = i18n.language;

    const comunasData = results.queries.comunas
      ? results.queries.comunas.data
      : [];
    const regionesData = results.queries.regiones
      ? results.queries.regiones.data
      : [];

    const fakeMsrName = results.queries.regiones
      ? results.queries.regiones.data[0]["FOB US"] ? "FOB US" : "CIF US"
      : "";

    const configBase = {
      height: 700,
      padding: 3,
      tiles: false,
      fitKey: "id",
      ocean: "#d8d8d8",
      shapeConfig: {
        Path: {
          stroke: 0
        },
        hoverOpacity: 1
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
      duration: 0,
      zoom: true,
      zoomFactor: 2,
      zoomMax: 100
    };

    const configVariations = {
      comunas: {
        id: "ID Comuna",
        topojson: "/geo/comunas-5.json",
        topojsonId: "id",
        topojsonKey: "comunas_datachile_final",
        groupBy: "ID Comuna",
        data: this.processResults(comunasData, fakeMsrName, mapYear),
        label: d => d["Comuna"]
      },
      regiones: {
        id: "ID Region",
        topojson: "/geo/regiones.json",
        topojsonId: "id",
        topojsonKey: "regiones",
        data: this.processResults(regionesData, fakeMsrName, mapYear),
        groupBy: "ID Region",
        label: d => d["Region"]
      }
    };

    const config = Object.assign({}, configBase, configVariations[mapLevel]);

    return (
      <div className="map-content">
        <div className="map-color-scale" />
        <Geomap config={config} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    topic: state.map.params.topic.value,
    msrName: "CIF US",
    mapLevel: state.map.level.value,
    mapYear: state.map.year.value,
    results: state.map.results
  };
};

MapContent = translate()(connect(mapStateToProps)(MapContent));

export default MapContent;
export { MapContent };
