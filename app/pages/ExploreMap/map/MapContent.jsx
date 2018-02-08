import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Geomap } from "d3plus-react";
import "./MapContent.css";

class MapContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    const configBase = {
      data: [
        { id: 1, name: "Tarapacá" },
        { id: 2, name: "Antofagasta" },
        { id: 3, name: "Atacama" },
        { id: 4, name: "Coquimbo" },
        { id: 5, name: "Valparaíso" },
        { id: 6, name: "O'Higgins" },
        { id: 7, name: "Maule" },
        { id: 8, name: "BíoBío" },
        { id: 9, name: "Araucanía" },
        { id: 10, name: "Los Lagos" },
        { id: 11, name: "Aisén" },
        { id: 12, name: "Magallanes" },
        { id: 13, name: "Metropolitana" },
        { id: 14, name: "Los Ríos" },
        { id: 15, name: "Arica y Parinacota" }
      ],
      id: "id",
      downloadButton: false,
      height: 500,
      label: d => {
        return d["name"];
      },
      legend: false,
      ocean: "transparent",
      padding: 10,
      shapeConfig: {
        hoverOpacity: 1,
        Path: {
          fill: "green",
          stroke: "rgba(255, 255, 255, 1)"
        }
      },
      tiles: false,
      tooltipConfig: {
        title: "",
        body: d => {
          return "Región " + d.name;
        },
        bodyStyle: {
          "font-family": "'Yantramanav', sans-serif",
          "font-size": "12px",
          "text-align": "center",
          color: "#2F2F38"
        },
        footer: "",
        background: "white",
        footerStyle: {
          "margin-top": 0
        },
        padding: "10px",
        borderRadius: "0px",
        border: "1px solid #2F2F38"
      },

      zoom: true
    };

    const configVariations = {
      comunas: {
        topojson: "/geo/comunas.json",
        topojsonId: "id",
        topojsonKey: "comunas"
      },
      regiones: {
        topojson: "/geo/regiones.json",
        topojsonId: "id",
        topojsonKey: "regiones"
      }
    };

    const mapType = "regiones";

    const config = Object.assign({}, configBase, configVariations[mapType]);
    console.log(config);

    return <Geomap className="map-content" config={config} />;
  }
}

MapContent = translate()(connect(state => ({}))(MapContent));

export default MapContent;
export { MapContent };
