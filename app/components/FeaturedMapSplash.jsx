import React, { Component } from "react";
import { translate } from "react-i18next";
import { text as loadSvgAsString } from "d3-request";
import { Geomap } from "d3plus-react";
import { sources } from "helpers/consts";

import SVGCache from "helpers/svg";

import SourceTooltip from "components/SourceTooltip";

// import "./FeaturedDatumSplash.css";
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

    if (this.props.code && this.props.type == "region") {
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
    if (this.props.code && this.props.type == "region") {
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
      this.props.code &&
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
    const {
      t,
      datum,
      type,
      title,
      subtitle,
      code,
      source,
      className
    } = this.props;

    const sourceData = sources[source];

    return (
      <div className={"featured-datum-splash featured-map-splash " + className}>

        {/* map */}
        <div className="featured-datum-icon">
          {type &&
            type == "region" && (
              <div
                className="svg-mini-map region-svg-mini-map"
                ref="svgcontainer"
                dangerouslySetInnerHTML={{ __html: this.state.svgFile }}
              />
            )}

          {type &&
            type == "country" && (
              <div className="svg-mini-map country-svg-mini-map">
                <Geomap
                  config={{
                    data: [],
                    downloadButton: false,
                    groupBy: "key",
                    height: 100,
                    width: 100,
                    label: d => "Región ",
                    legend: false,
                    ocean: "transparent",
                    padding: 0,
                    shapeConfig: {
                      hoverOpacity: 1,
                      Path: {
                        fill: function(d) {
                          return d.id == code ? "#3277dc" : "none";
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

        {/* title */}
        <p className="featured-datum-label label font-xs" aria-hidden="true">
          {title}
        </p>

        {/* value */}
        <h3 className="featured-datum-value font-xl">
          <span className="u-visually-hidden">{title} </span>
          {datum ? datum : t("no_datum")}
          <SourceTooltip sourceData={sourceData} />
        </h3>

        {/* subtitle */}
        {subtitle && (
          <p className="featured-datum-subtitle font-sm label">{subtitle}</p>
        )}
      </div>
    );
  }
}

export default translate()(FeaturedMapSplash);
