import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { text as loadSvgAsString, request as d3Request } from "d3-request";
import { Geomap } from "d3plus-react";
import { select, selectAll, event } from "d3-selection";

import SVGCache from "helpers/svg";
import { FORMATTERS } from "helpers/formatters";

import SvgImage from "components/SvgImage";

import "./DynamicHomeHeader.css";

class DynamicHomeHeader extends Component {
  constructor(props) {
    super(props);
    this.cache = SVGCache.instance;
    this.state = {
      illustration: ""
    };

    this.callbackSvg = this.callbackSvg.bind(this);
    //this.paintMountains = //this.paintMountains.bind(this);
  }

  callbackSvg(error, response, src) {
    const { header } = this.props;
    var xml = response.responseText ? response.responseText : response;
    if (!xml.startsWith("<?xml")) {
      this.setState({
        illustration: "Error loading SVG"
      });
      console.error("Error loading " + src);
    } else {
      this.cache.setSvg(src, xml);
      this.setState(
        {
          illustration: xml
        },
        () => {
          if (typeof document != "undefined") {
            select(".dynamic-home-image")
              .transition()
              .duration(500)
              .style("opacity", 1);

            /*select(".dynamic-home-hotspots")
              .transition()
              .duration(1500)
              .style("opacity", 1);*/

            selectAll(".dynamic-home-hotspots ellipse.st0")
              .on("mouseover", function(d) {
                //select(this).classed("fill-" + header.slug, true);
                console.log("mouseover", this);
                /*div
                  .transition()
                  .duration(200)
                  .style("opacity", 0.9);
                div
                  .html(formatTime(d.date) + "<br/>" + d.close)
                  .style("left", d3.event.pageX + "px")
                  .style("top", d3.event.pageY - 28 + "px");*/
              })
              .on("mouseout", function(d) {
                console.log("mouseout");
                //select(this).classed("fill-" + header.slug, false);
                /*div
                  .transition()
                  .duration(500)
                  .style("opacity", 0);*/
              });
          }
        }
      );
    }
  }

  componentWillMount() {
    this.loadHeader(this.props.header);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.header) {
      this.loadHeader(nextProps.header);
    }
  }

  loadHeader(header) {
    if (typeof document != "undefined" && header) {
      const src = "/images/home/hotspots/" + header.slug + ".svg";
      const cb = this.callbackSvg;
      var cached = this.cache.getSvg(src);
      /*select(".dynamic-home-hotspots")
        .transition()
        .duration(500)
        .style("opacity", 0);*/
      select(".dynamic-home-image")
        .transition()
        .duration(500)
        .style("opacity", 0);
      if (cached) {
        cb(false, cached, src);
      } else {
        d3Request(src)
          .on("error", function(error) {
            console.error(error);
          })
          .get(src, function(error, response) {
            cb(error, response, src);
          });
      }
    }
  }

  render() {
    const { t, header } = this.props;

    return (
      <div className="dynamic-home-header">
        <div className="dynamic-home-explore-btn">
          <Link
            className={`explore-btn background-${header.slug}`}
            href={`/explore/${header.slug}`}
          >
            <span>{t("Explore profiles")}</span>
            <span className="pt-icon-standard pt-icon-chevron-right" />
          </Link>
        </div>
        <div className="dynamic-home-illustration">
          <div id="mountains-home">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 1960 281"
              style={{ enableBackground: "new 0 0 1960 281" }}
            >
              <g>
                <polyline
                  className="back"
                  points="1.4,282.6 0,82 154.6,142 422.5,60 908.2,124 1169.2,60 1529.4,101 1966,0.3 1963.9,279.6     "
                  style={{ fill: header.colors[1] }}
                />
                <polyline
                  className="front"
                  points="0.7,283.6 0,224.4 66.2,163.2 251.6,236.7 453.2,126.2 735.9,263.3 1003.6,142.7 1160.4,174.7 
                    1358.5,114.1 1502.8,138.7 1778.6,59 1959,229.6 1959.1,280.6"
                  style={{ fill: header.colors[0] }}
                />
              </g>
            </svg>
          </div>
          <div
            className="dynamic-home-block"
            style={{ backgroundColor: header.colors[2] }}
          />
          {header && (
            <div className={`dynamic-home-items illustration-${header.slug}`}>
              <div
                className="dynamic-home-hotspots"
                dangerouslySetInnerHTML={{ __html: this.state.illustration }}
              />
              <div className={`dynamic-home-image`}>
                <img src={`/images/home/headers/${header.slug}.png`} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default translate()(connect(state => ({}), {})(DynamicHomeHeader));
