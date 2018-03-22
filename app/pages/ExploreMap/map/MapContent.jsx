import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Geomap } from "d3plus-react";
import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { MAP_SCALE_COLORS } from "helpers/colors";

import { percentRank } from "helpers/calculator";

import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

import MapYearSelector from "./MapYearSelector";

import NoDataAvailable from "components/NoDataAvailable";

import MapScaleSelector from "./MapScaleSelector";
import MapOptions from "./MapOptions";
import MapApiCall from "./MapApiCall";

import "./MapContent.css";

class MapContent extends React.Component {
  state = { ssr: true };

  componentDidMount() {
    this.setState({ ssr: false });
  }

  getTooltipTitle(type, name) {
    return `<div class="tooltip-title"><p class="type">${type}</p><p>${name}</p></div>`;
  }

  getTooltipBody = d => {
    const { t, i18n, mapTitle, mapYear, msrName } = this.props;

    return `<div class="tooltip-body">
      <div class='tooltip-data-value'>${numeral(
        d[msrName],
        i18n.language
      ).format("(0.[00] a)")}</div>
      <div class='tooltip-data-title'>${mapTitle} ${t(" in ")} ${mapYear}</div>
    </div`;
  };

  render() {
    const {
      t,
      i18n,
      mapTopic,
      msrName,
      mapLevel,
      mapScale,
      mapYear,
      dataRegion,
      dataComuna
    } = this.props;

    if (dataRegion.length == 0) {
      if (!msrName || this.state.ssr) return null;
      return (
        <div className="map-render no-data">
          <NoDataAvailable />
        </div>
      );
    }

    const locale = i18n.language;

    let customTick = "";

    const configBase = {
      height: 700,
      padding: 3,
      tiles: false,
      fitKey: "id",
      ocean: false,
      shapeConfig: {
        Path: {
          stroke: 0
        },
        hoverOpacity: 1
      },
      label: false,
      sum: d =>
        d[
          mapScale === "linear"
            ? msrName
            : mapScale === "log" ? msrName + "LOG" : msrName + "PERC"
        ],
      colorScale:
        mapScale === "linear"
          ? msrName
          : mapScale === "log" ? msrName + "LOG" : msrName + "PERC",
      colorScalePosition: "right",
      colorScaleConfig: {
        color: MAP_SCALE_COLORS.getItem(mapTopic),
        axisConfig: {
          shapeConfig: {
            labelConfig: {
              fontColor: "#000"
            }
          },
          //   tickFormat: tick => {
          //     return numeral(parseFloat(tick), "es").format("($ 0.[00] a)");
          //   },
          tickFormat: tick => {
            if (mapScale === "log") {
              let value = Math.pow(10, parseInt(tick));

              let newTick = numeral(value, locale).format("0.[0] a");
              if (newTick !== customTick) {
                customTick = newTick;
                return newTick;
              } else {
                return " ";
              }
            } else if (mapScale === "linear") {
              return numeral(parseInt(tick), locale).format("0.[0] a");
            } else {
              let value = parseInt(tick);

              let newTick = numeral(value, locale).format("0.[0] a");
              if (newTick !== customTick) {
                customTick = newTick;
                return newTick + " " + t("decile");
              } else {
                return " ";
              }
            }
          }
        },
        downloadButton: false,
        select: ".map-color-scale",
        align: "start"
      },
      tooltipConfig: {
        id: "map",
        duration: 0,
        className: "d3plus-tooltip-map-topic-" + mapTopic,
        titleStyle: {
          "background-color": MAP_SCALE_COLORS.getItem(mapTopic)[7],
          padding: 0
        },
        bodyStyle: {
          "background-color": "#fff",
          color: MAP_SCALE_COLORS.getItem(mapTopic)[7]
        },
        title:
          mapLevel == "comuna"
            ? d => this.getTooltipTitle(t("Comuna"), d["Comuna"])
            : d => this.getTooltipTitle(t("Region"), d["Region"]),
        body: this.getTooltipBody
      },
      messageHTML:
        "<div style='font-family: Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;'>" +
        "<img style='margin: auto; width:80px; height: 80px' src='/images/loading-visualization.gif' />" +
        "<sub style='display: block; margin-top: 15px; color: #fff'>Powered by Datawheel</sub>" +
        "</div>",
      duration: 0,
      zoom: true,
      zoomFactor: 2,
      zoomScroll: false
    };

    let configVariations = {};

    if (mapLevel == "comuna") {
      configVariations = {
        id: "ID Comuna",
        topojson: "/geo/comunas.json",
        topojsonId: "id",
        topojsonKey: "comunas_datachile_final",
        groupBy: "ID Comuna",
        data: processResults(dataComuna, msrName, mapYear),
        label: d => d["Comuna"],
        zoomMax: 100
      };
    } else {
      configVariations = {
        id: "ID Region",
        topojson: "/geo/regiones.json",
        topojsonId: "id",
        topojsonKey: "regiones",
        data: processResults(dataRegion, msrName, mapYear),
        groupBy: "ID Region",
        label: d => d["Region"],
        zoomMax: 20
      };
    }

    const config = Object.assign({}, configBase, configVariations);

    return (
      <div className="map-content">
        <svg className="map-color-scale" />
        <div className="map-render">
          <Geomap config={config} />
        </div>
        <MapYearSelector />
        <MapScaleSelector />
        <MapApiCall />
      </div>
    );
  }
}

const processResults = (data, msrName, mapYear) => {
  // Check if there are data available for this chart
  if (mapYear) data = data.filter(item => item["Year"] == mapYear);

  const msrValues = data.map(item => item[msrName]).sort();

  // if (msrName) data = data.map(item => ({ ...item, variable: item[msrName] }));
  //const values = data.filter(item => item[msrName]).map(item => item[msrName]);
  return data.map(item => {
    item[msrName + "LOG"] = Math.log10(item[msrName]);
    item[msrName + "PERC"] = Math.ceil(
      percentRank(msrValues, item[msrName]) * 10
    );
    return item;
  });
};

const mapStateToProps = (state, ownProps) => {
  const msrName = state.map.params.measure.value;
  return {
    msrName,
    params: state.map.params,
    mapTopic: state.map.params.topic.value,
    mapLevel: state.map.params.level,
    mapScale: state.map.params.scale,
    mapYear: state.map.params.year,
    mapTitle: state.map.title,
    dataRegion: (state.map.results.data.region || []).filter(
      item => item[msrName]
    ),
    dataComuna: (state.map.results.data.comuna || []).filter(
      item => item[msrName]
    )
  };
};

export default translate()(connect(mapStateToProps)(MapContent));
