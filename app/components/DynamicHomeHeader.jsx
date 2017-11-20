import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Link, browserHistory } from "react-router";
import { translate } from "react-i18next";
import { text as loadSvgAsString, request as d3Request } from "d3-request";
import { Geomap } from "d3plus-react";
import { select, selectAll, event, mouse } from "d3-selection";

import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient from "helpers/MondrianClient";
import SVGCache from "helpers/svg";
import { FORMATTERS } from "helpers/formatters";

import SvgImage from "components/SvgImage";

import "./DynamicHomeHeader.css";

class DynamicHomeHeader extends Component {
  static need = [
    (params, store) => {
      const prm = mondrianClient
        .cube("population_estimate")
        .then(cube => {
          var q = cube.query
            .drilldown("Date", "Year")
            .drilldown("Geography", "Geography", "Region")
            .measure("Population")
            .cut(`[Date].[Year].&[${store.population_year}]`);

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "home_geo_population",
            data: _.keyBy(res.data.data, function(o) {
              return "geo_" + o["ID Region"];
            })
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
    this.cache = SVGCache.instance;
    this.state = {
      illustration: ""
    };

    this.callbackSvg = this.callbackSvg.bind(this);
  }

  callbackSvg(error, response, src) {
    const { header, data } = this.props;
    var xml = response.responseText ? response.responseText : response;
    var that = this;
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

            var div = select("#tooltip-home");

            function getCoords(x, y) {
              const w = window.innerWidth,
                imgW = 1366,
                imgH = 241;
              const h = imgH * w / imgW;

              return [x * w / imgW, y * h / imgH];
            }

            selectAll(".dynamic-home-hotspots ellipse.st0")
              .on("mouseover", function(d) {
                var elem = select(this);
                var coords = getCoords(elem.attr("cx"), elem.attr("cy"));

                div
                  .transition()
                  .duration(200)
                  .style("opacity", 1);
                div
                  .style("left", coords[0] - 75 + "px")
                  .style("top", coords[1] + 9 + "px");

                const name = that.getTooltipName(elem.attr("id"));
                div.select(".tooltip-title").html(name);

                const data_collection = that.getTooltipData(elem.attr("id"));
                div
                  .select(".tooltip-body")
                  .html(
                    data_collection
                      .map(
                        d =>
                          "<div class='tooltip-data-value color-" +
                          that.props.header.slug +
                          "'>" +
                          d.value +
                          "</div><div class='tooltip-data-title'>" +
                          d.title +
                          "</div>"
                      )
                      .join("")
                  );
              })
              .on("mouseout", function(d) {
                div
                  .transition()
                  .duration(500)
                  .style("opacity", 0);
              })
              .on("click", function(d) {
                var elem = select(this);
                const name = that.getTooltipName(elem.attr("id"));
                if (elem.attr("id") === null) {
                  console.error("No attribute 'id' on svg file");
                } else {
                  var url = slugifyItem(
                    that.props.header.slug,
                    elem.attr("id"),
                    name
                  );
                  browserHistory.push(url);
                }
              });
          }
        }
      );
    }
  }

  getTooltipName(id) {
    const { t, header, data } = this.props;
    var name = "";
    switch (header.slug) {
      case "geo":
        name = data.home_geo_population["geo_" + id].Region;
        break;
    }
    return name;
  }

  getTooltipData(id) {
    const { t, header, data, i18n } = this.props;
    const locale = i18n.language.split("-")[0];

    var datas = [];
    switch (header.slug) {
      case "geo":
        datas.push({
          title: t("Estimate Population 2017"),
          value:
            numeral(
              data.home_geo_population["geo_" + id].Population,
              locale
            ).format("(0,0)") + " hab."
        });
        break;
    }
    return datas;
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
          <div id="tooltip-home">
            <div className={`tooltip-title background-${header.slug}`} />
            <div className={`tooltip-body`} />
          </div>
          <div id="mountains-home">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 1960 281"
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

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(DynamicHomeHeader)
);
