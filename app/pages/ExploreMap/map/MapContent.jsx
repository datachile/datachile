import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Geomap } from "d3plus-react";
import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { MAP_SCALE_COLORS } from "helpers/colors";

import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

import "./MapContent.css";

class MapContent extends React.Component {
  render() {
    const {
      t,
      i18n,
      mapTopic,
      msrName,
      mapLevel,
      mapYear,
      dataRegion,
      dataComuna
    } = this.props;

    const locale = i18n.language;

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
        color: MAP_SCALE_COLORS[mapTopic],
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
        title: mapLevel == "comuna" ? d => d["Comuna"] : d => d["Region"],
        body: d => numeral(d[msrName], locale).format("(USD 0 a)")
      },
      duration: 0,
      zoom: true,
      zoomFactor: 2,
      zoomMax: 100
    };

    const configVariations = {
      comuna: {
        id: "ID Comuna",
        topojson: "/geo/comunas.json",
        topojsonId: "id",
        topojsonKey: "comunas_datachile_final",
        groupBy: "ID Comuna",
        data: processResults(dataComuna, msrName, mapYear),
        label: d => d["Comuna"]
      },
      region: {
        id: "ID Region",
        topojson: "/geo/regiones.json",
        topojsonId: "id",
        topojsonKey: "regiones",
        data: processResults(dataRegion, msrName, mapYear),
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

const processResults = (data, msrName, mapYear) => {
  if (mapYear) data = data.filter(item => item["Year"] == mapYear);
  if (msrName) data = data.map(item => ({ ...item, variable: item[msrName] }));
  return data;
};

const mapStateToProps = (state, ownProps) => {
  return {
    msrName: state.map.params.measure.value,
    mapTopic: state.map.params.topic.value,
    mapLevel: state.map.params.level,
    mapYear: state.map.params.year,

    dataRegion: state.map.results.data.region || [],
    dataComuna: state.map.results.data.comuna || []
  };
};

MapContent = translate()(connect(mapStateToProps)(MapContent));

export default MapContent;
export { MapContent };
