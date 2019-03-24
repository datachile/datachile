import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { text as loadSvgAsString } from "d3-request";
import { select, selectAll, event, mouse } from "d3-selection";
import { GEOMAP } from "helpers/GeoData";
import { slugifyItem } from "helpers/formatters";
import SVGCache from "helpers/svg";
import "./SvgMap.css";

class SvgMap extends Component {
  constructor(props) {
    super(props);
    this.cache = SVGCache.instance;
    this.state = {
      svgFile: ""
    };

    this.callbackSvg = this.callbackSvg.bind(this);
    this.launchEvents = this.launchEvents.bind(this);
  }

  callbackSvg(error, xml) {
    if (error) throw error;
    this.cache.setSvg(
      "/images/maps/zoom/comunas-" + this.props.region.key + ".svg",
      xml
    );
    this.setState(
      {
        svgFile: xml
      },
      function() {
        this.launchEvents();
      }
    );
  }

  componentDidMount() {
    var src = "/images/maps/zoom/comunas-" + this.props.region.key + ".svg";
    var cached = this.cache.getSvg(src);
    if (cached) {
      this.callbackSvg(false, cached);
    } else {
      loadSvgAsString(src).get(this.callbackSvg);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.region.key !== this.props.region.key) {
      loadSvgAsString(
        "/images/maps/zoom/comunas-" + this.props.region.key + ".svg"
      ).get(this.callbackSvg);
    }
    if (nextProps.active.key !== this.props.active.key) {
      this.prepareSelected(nextProps.active.key);
    }
  }

  prepareSelected(active) {
    selectAll(".svg-map .comuna").classed("selected", false);
    select(".svg-map .comuna#c" + active).classed("selected", true);
    select(".svg-map #svg-map-tooltip").style("transform", "scale(0)");
  }

  launchEvents() {
    this.prepareSelected(this.props.active.key);

    const { t, router } = this.props;

    var slug = this.props.slug;

    var tooltip = select(".svg-map #svg-map-tooltip");

    var region = this.props.region;

    selectAll(".svg-map .comuna")
      .on("mouseover", function(d, a) {
        var coordinates = mouse(select(".map-comuna").node());
        var d = select(this);
        var id = d.classed("hover", true).attr("id");
        tooltip
          .transition()
          .duration(200)
          .style("transform", "scale(1)");
        tooltip
          .html(
            "Comuna " +
              d.attr("name") +
              "<br/><a>" +
              t("tooltip.view_profile") +
              "</a>"
          )
          .style("left", coordinates[0] - 80 + "px")
          .style("top", coordinates[1] + "px");
      })
      .on("mouseout", function(d, a) {
        select(this).classed("hover", false);
        tooltip
          .transition()
          .duration(200)
          .style("transform", "scale(0)");
      })
      .on("mousemove", function(d, a) {
        var coordinates = mouse(select(".map-comuna").node());

        tooltip
          .style("left", coordinates[0] - 80 + "px")
          .style("top", coordinates[1] + "px");
      })
      .on("click", function() {
        var d = select(this);
        router.push(
          slugifyItem(
            "geo",
            region.key,
            region.name,
            d.attr("id").replace("c", ""),
            d.attr("name")
          )
        );
      });

    selectAll(".svg-map .region")
      .on("mouseover", function(d, a) {
        var coordinates = mouse(select(".map-comuna").node());
        var d = select(this);
        var id = d.classed("hover", true).attr("id");
        tooltip
          .transition()
          .duration(200)
          .style("transform", "scale(1)")
          .style("opacity", 1);
        tooltip
          .html(
            "Región " +
              d.attr("name") +
              "<br/><a>" +
              t("tooltip.view_profile") +
              "</a>"
          )
          .style("left", coordinates[0] - 80 + "px")
          .style("top", coordinates[1] + "px");
      })
      .on("mouseout", function(d, a) {
        select(this).classed("hover", false);
        tooltip
          .transition()
          .duration(200)
          .style("transform", "scale(0)")
          .style("opacity", 0);
      })
      .on("mousemove", function(d, a) {
        var coordinates = mouse(select(".map-comuna").node());
        tooltip
          .style("left", coordinates[0] - 80 + "px")
          .style("top", coordinates[1] + "px");
      })
      .on("click", function() {
        var d = select(this);
        router.push(slugifyItem("geo", d.attr("id"), d.attr("name")));
      });
  }

  render() {
    const { t, slug, active } = this.props;

    return (
      <div className="svg-map" key={slug}>
        <div
          id="svg-map-tooltip"
          className="datachile-tooltip svg-map-tooltip"
        />
        <div
          ref="svgcontainer"
          dangerouslySetInnerHTML={{ __html: this.state.svgFile }}
        />
      </div>
    );
  }
}

export default translate()(SvgMap);
