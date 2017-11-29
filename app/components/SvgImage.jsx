import React, { Component } from "react";
import { request as d3Request } from "d3-request";
import { select, selectAll, event } from "d3-selection";
import { translate } from "react-i18next";
import SVGCache from "helpers/svg";

class SvgImage extends Component {
  constructor(props) {
    super(props);
    this.cache = SVGCache.instance;
    this.state = {
      svgFile: ""
    };

    this.callbackSvg = this.callbackSvg.bind(this);
  }

  callbackSvg(error, response) {
    var xml = response.responseText ? response.responseText : response;
    if (!xml.startsWith("<?xml")) {
      this.setState({
        svgFile: "Error loading SVG"
      });
      this.props.callbackError
        ? this.props.callbackError()
        : console.error("Error loading " + this.props.src);
    } else {
      this.cache.setSvg(this.props.src, xml);
      this.setState({
        svgFile: xml
      });
      if (this.props.callback) {
        this.props.callback();
      }
    }
  }

  componentDidMount() {
    var cached = this.cache.getSvg(this.props.src);
    if (cached) {
      this.callbackSvg(false, cached);
    } else {
      d3Request(this.props.src)
        .on("error", function(error) {
          this.props.callbackError
            ? this.props.callbackError()
            : console.error(error);
        })
        .get(this.props.src, this.callbackSvg);
    }
  }

  /*componentWillReceiveProps(nextProps) {
    if (nextProps.slug !== this.props.slug) {
      loadSvgAsString('/images/maps/zoom/'+nextProps.slug+'.svg').get(this.callbackSvg);
    }
    if (nextProps.active !== this.props.active) {
      this.prepareSelected(nextProps.active);
    }
  };*/

  render() {
    const { t, extraClass } = this.props;

    const clase = extraClass ? extraClass : "";

    return (
      <div
        className={`svg-image ${clase}`}
        dangerouslySetInnerHTML={{ __html: this.state.svgFile }}
      />
    );
  }
}

export default translate()(SvgImage);
