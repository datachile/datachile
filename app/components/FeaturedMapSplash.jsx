import React, { Component } from "react";
import { translate } from "react-i18next";
import { text as loadSvgAsString } from "d3-request";
import { Geomap } from "d3plus-react";

import SVGCache from "helpers/svg";

import "./FeaturedDatumSplash.css";
import "./FeaturedMapSplash.css";

class FeaturedMapSplash extends Component {
  constructor(props) {
    super(props);
    this.cache = SVGCache.instance;
    this.state = {
      svgFile: ""
    };

    this.callbackSvg = this.callbackSvg.bind(this);
  }

  callbackSvg(error, xml) {
    if (error) throw error;

    if (this.props.type == "region") {
      this.cache.setSvg(
        "/images/maps/zoom/comunas-" + this.props.code + ".svg",
        xml
      );
      this.setState({
        svgFile: xml
      });
    }
  }

  componentDidMount() {
    if (this.props.type == "region") {
      var src = "/images/maps/zoom/comunas-" + this.props.code + ".svg";
      var cached = this.cache.getSvg(src);
      if (cached) {
        this.callbackSvg(false, cached);
      } else {
        loadSvgAsString(src).get(this.callbackSvg);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps == "region" &&
      this.props &&
      nextProps.code !== this.props.code
    ) {
      loadSvgAsString(
        "/images/maps/zoom/comunas-" + this.props.code + ".svg"
      ).get(this.callbackSvg);
    }
  }

  render() {
    const { t, datum, type, title, code, source, className } = this.props;

    return (
      <div className={"featured-datum-splash featured-map-splash " + className}>
        <h4 className="featured-datum-splash-title">{title}</h4>
        <div className="featured-datum-splash-icons">
          {type &&
            type == "region" && (
              <div
                className="svg-mini-map"
                ref="svgcontainer"
                dangerouslySetInnerHTML={{ __html: this.state.svgFile }}
              />
            )}

          {type &&
            type == "country" && (
              <div className="svg-mini-geomap">
                <Geomap
                  config={{
                    data: [],
                    downloadButton: false,
                    groupBy: "key",
                    height: 80,
                    width: 80,
                    label: d => "Región ",
                    legend: false,
                    ocean: "transparent",
                    padding: 0,
                    shapeConfig: {
                      hoverOpacity: 1,
                      Path: {
                        fill: function(d) {
                          return d.id == code ? "#4B71B5" : "none";
                        },
                        stroke: "rgba(255, 255, 255, 1)"
                      }
                    },
                    tiles: false,
                    topojson: "/geo/countries.json",
                    topojsonId: "id",
                    topojsonKey: "id",
                    topojsonFilter: d => d.id == code,
                    fitKey: code,
                    zoom: false
                  }}
                />
              </div>
            )}
        </div>
        <div className="featured-datum-splash-data">
          <p className="featured-datum-data">{datum}</p>
        </div>
        <h6 className="featured-datum-splash-source">{source}</h6>
      </div>
    );
  }
}

export default translate()(FeaturedMapSplash);
