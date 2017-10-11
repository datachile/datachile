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
      this.paintMountains = this.paintMountains.bind(this);
  }

  callbackSvg(error, response) {
    var xml = (response.responseText)?response.responseText:response;
    var src = "/images/home/headers/" + this.props.header.slug + ".svg";
    if (!xml.startsWith("<?xml")){
      this.setState(
        {
          illustration: "Error loading SVG"
        }
      );
      console.error('Error loading '+src);
    } else {
      this.cache.setSvg(src, xml);
      this.setState(
        {
          illustration: xml
        },
        () => {
          
        }
      );
    }

  }

  componentWillMount() {
    this.paintMountains(this.props.header);
    this.loadHeader(this.props.header);
  }

  componentDidMount() {
    this.paintMountains(this.props.header);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.header) {
      this.paintMountains(nextProps.header);
      this.loadHeader(nextProps.header);
    }
  }

  loadHeader(header){
    if(typeof document != "undefined" && header){
      const src = "/images/home/headers/" + header.slug + ".svg";
        d3Request(src)
          .on("error", function(error) { console.error(error); })
          .get(src,this.callbackSvg);
    }
  }

  paintMountains(header){
    if(typeof document != "undefined" && header){
      select('.dynamic-home-header .st0').transition().duration(500).style('fill',header.colors[0]);
      select('.dynamic-home-header .st1').transition().duration(500).style('fill',header.colors[1]);
      select('.dynamic-home-block').transition().duration(500).style('background-color',header.colors[0]);
    }
  }


  render() {
      const { t, header } = this.props;

      const mountainsLoaded = () => {
        this.paintMountains(header);
      }

      const mountainsLoadedError = () => {
      }

      return (
          <div className="dynamic-home-header">
            <div className="dynamic-home-illustration">
              <SvgImage src={`/images/home/mountains.svg`} callback={mountainsLoaded} callbackError={mountainsLoadedError}/>
              { 
                header &&
                <div className="dynamic-home-items"
                    dangerouslySetInnerHTML={{ __html: this.state.illustration }}
                  />
              }
            </div>
            <div className="dynamic-home-block"></div>
          </div>
      );
  }
}

export default translate()(connect(state => ({}), {})(DynamicHomeHeader));
