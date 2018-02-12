import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Geomap } from "d3plus-react";
import "./MapContent.css";

class MapContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map_level: "regiones"
    };
  }

  menuChart(selected) {
    const { t } = this.props;
    return (
      <div className="map-switch-options">
        <a
          className={`toggle ${selected === "comunas" ? "selected" : ""}`}
          onClick={evt => this.toggleChart("comunas")}
        >
          {t("Comunas")}
        </a>
        {" | "}
        <a
          className={`toggle ${selected === "regiones" ? "selected" : ""}`}
          onClick={evt => this.toggleChart("regiones")}
        >
          {t("Regiones")}
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
    const { t } = this.props;
    const configBase = {
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
          console.log(d);
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
        topojsonKey: "comunas_datachile_final",
        data: []
      },
      regiones: {
        topojson: "/geo/regiones.json",
        topojsonId: "id",
        topojsonKey: "regiones",
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
        ]
      }
    };

    const mapType = this.state.map_level;

    const config = Object.assign({}, configBase, configVariations[mapType]);
    console.log("mapType", mapType);

    return (
      <div className="map-content">
        <div>{this.menuChart(mapType)}</div>
        <Geomap config={config} />
      </div>
    );
  }
}

MapContent = translate()(connect(state => ({}))(MapContent));

export default MapContent;
export { MapContent };
