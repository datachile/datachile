import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { text as loadSvgAsString } from "d3-request";
import { Geomap } from "d3plus-react";
import { select, selectAll, event } from "d3-selection";

import SVGCache from "helpers/svg";
import { FORMATTERS } from "helpers/formatters";

import SvgImage from "components/SvgImage";

import "./DynamicHomeHeader.css";

class DynamicHomeHeader extends Component {

  constructor(props) {
      console.warn('constructor',props);
      super(props);
      this.cache = SVGCache.instance;
      this.state = {
        svgFile: ""
      };

      this.callbackSvg = this.callbackSvg.bind(this);
      this.paintMountains = this.paintMountains.bind(this);
  }

  callbackSvg(error, xml) {
    /*if (error) throw error;
      
    if(this.props.header){
      this.cache.setSvg(
        "/images/home/headers/" + this.state.header.slug + ".svg",
        xml
      );
      this.setState(
        {
          svgFile: xml
        }
      );
    }*/
  }

  componentWillMount() {
    console.warn('componentWillMount',this.props);
    this.paintMountains(this.props.header);
  }

  componentDidMount() {
    console.warn('componentDidMount',this.props);
    this.paintMountains(this.props.header);
    /*if(this.props.header){
      var src = "/images/home/headers/" + this.props.header.slug + ".svg";
      var cached = this.cache.getSvg(src);
      if (cached) {
        this.callbackSvg(false, cached);
      } else {
        loadSvgAsString(src).get(this.callbackSvg);
      }
    }*/
  }

  componentWillReceiveProps(nextProps) {
    console.warn('componentWillReceiveProps',nextProps);
    this.paintMountains(nextProps.header);
    /*if (nextProps && nextProps.header && (nextProps.header.slug !== this.props.header.slug)) {
      loadSvgAsString(
        "/images/home/headers/" + this.state.header.slug + ".svg"
      ).get(this.callbackSvg);
    }*/
  }

  paintMountains(header){
    if(typeof document != "undefined" && header){
      select('.dynamic-home-header .st0').transition().duration(500).style('fill',header.colors[0]);
      select('.dynamic-home-header .st1').transition().duration(500).style('fill',header.colors[1]);
    }
  }


  render() {
      const { t, header } = this.props;

      const mountainsLoaded = () => {
        console.log('mountainsLoaded');
        this.paintMountains(header);
      }

      const mountainsLoadedError = () => {
        console.log('mountainsLoadedError');
      }

            /*<div className="dynamic-home-svg">
              { 
                header &&
                <div className="dynamic-home-illustration"
                    dangerouslySetInnerHTML={{ __html: this.state.svgFile }}
                  />
              }
            </div>*/
      return (
          <div className="dynamic-home-header">
            <SvgImage src={`/images/home/mountains.svg`} callback={mountainsLoaded} callbackError={mountainsLoadedError}/>
          </div>
      );
  }
}

export default translate()(connect(state => ({}), {})(DynamicHomeHeader));
