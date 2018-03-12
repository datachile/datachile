import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Geomap } from "d3plus-react";
import { numeral, getNumberFromTotalString } from "helpers/formatters";
import { MAP_SCALE_COLORS } from "helpers/colors";

import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

import MapYearSelector from "./MapYearSelector";

import NoDataAvailable from "components/NoDataAvailable";

import MapScaleSelector from "./MapScaleSelector";
import MapOptions from "./MapOptions";
import MapApiCall from "./MapApiCall";

import "./MapContent.css";

class MapContent extends React.Component {
	state = {
		show: true
	};

	getTooltipTitle(type, name) {
		return `<div class="tooltip-title"><p class="type">${type}</p><p>${name}</p></div>`;
	}

	getTooltipBody(str) {
		const { t, mapTitle, mapYear } = this.props;
		return `<div class="tooltip-body">
      <div class='tooltip-data-value'>${str}</div>
      <div class='tooltip-data-title'>${mapTitle} ${t(" in ")} ${mapYear}</div>
    </div`;
	}

	componentWillUpdate() {
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
		//console.log(dataRegion)
	}

	render() {
		const {
			t,
			i18n,
			lenRegion,
			lenComuna,
			mapTopic,
			msrName,
			mapLevel,
			mapScale,
			mapYear,
			dataRegion,
			dataComuna
		} = this.props;

		const locale = i18n.language;

		let customTick = "";

		/*dataRegion.filter(item => item[msrName]).length === 0
			? this.setState({ show: false })
			: this.setState({ show: true });*/

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
			sum: d => d[mapScale === "linear" ? msrName : msrName + "LOG"],
			colorScale: mapScale === "linear" ? msrName : msrName + "LOG",
			colorScalePosition: "right",
			colorScaleConfig: {
				color: MAP_SCALE_COLORS[mapTopic],
				axisConfig: {
					shapeConfig: {
						labelConfig: {
							fontColor: "#000"
						}
					},
					/*tickFormat: tick => {
            return numeral(parseFloat(tick), "es").format("($ 0.[00] a)");
          },*/
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
						} else {
							return numeral(parseInt(tick), locale).format("0.[0] a");
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
					"background-color": MAP_SCALE_COLORS[mapTopic][7],
					padding: 0
				},
				bodyStyle: {
					"background-color": "#fff",
					color: MAP_SCALE_COLORS[mapTopic][7]
				},
				title:
					mapLevel == "comuna"
						? d => this.getTooltipTitle(t("Comuna"), d["Comuna"])
						: d => this.getTooltipTitle(t("Region"), d["Region"]),
				body: d =>
					this.getTooltipBody(numeral(d[msrName], locale).format("(0.[00] a)"))
			},
			duration: 0,
			zoom: true,
			zoomFactor: 2,
			zoomScroll: false
		};

		const configVariations = {
			comuna: {
				id: "ID Comuna",
				topojson: "/geo/comunas.json",
				topojsonId: "id",
				topojsonKey: "comunas_datachile_final",
				groupBy: "ID Comuna",
				data: processResults(dataComuna, msrName, mapYear),
				label: d => d["Comuna"],
				zoomMax: 100
			},
			region: {
				id: "ID Region",
				topojson: "/geo/regiones.json",
				topojsonId: "id",
				topojsonKey: "regiones",
				data: processResults(dataRegion, msrName, mapYear),
				groupBy: "ID Region",
				label: d => d["Region"],
				zoomMax: 20
			}
		};

		const config = Object.assign({}, configBase, configVariations[mapLevel]);

		return (
			<div className="map-content">
				{lenRegion > 0 ? <svg className="map-color-scale" /> : <div />}
				<div className={lenRegion === 0 ? `map-render no-data`: `map-render`}>
					{lenRegion > 0 ? <Geomap config={config} /> : <NoDataAvailable />}
				</div>
				{lenRegion > 0 ? <MapYearSelector /> : <div />}
				<MapScaleSelector />
                      <MapApiCall />
			</div>
		);
	}
}

const processResults = (data, msrName, mapYear) => {
	// Check if there are data available for this chart

	if (mapYear) data = data.filter(item => item["Year"] == mapYear);
	// if (msrName) data = data.map(item => ({ ...item, variable: item[msrName] }));
	return data.filter(item => item[msrName]).map(item => {
		item[msrName + "LOG"] = Math.log10(item[msrName]);
		return item;
	});
};

const mapStateToProps = (state, ownProps) => {
	return {
		msrName: state.map.params.measure.value,
		mapTopic: state.map.params.topic.value,
		mapLevel: state.map.params.level,
		mapScale: state.map.params.scale,
		mapYear: state.map.params.year,
		mapTitle: state.map.title,

		lenRegion: state.map.results.data.region
			? state.map.results.data.region.filter(
					item => item[state.map.params.measure.value]
			  ).length
			: 0,
		lenComuna: state.map.results.data.comuna
			? state.map.results.data.comuna.filter(
					item => item[state.map.params.measure.value]
			  ).length
			: 0,

		dataRegion: state.map.results.data.region || [],
		dataComuna: state.map.results.data.comuna || []
	};
};

MapContent = translate()(connect(mapStateToProps)(MapContent));

export default MapContent;
export { MapContent };
