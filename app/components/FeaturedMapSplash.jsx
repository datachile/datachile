import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { text as loadSvgAsString } from "d3-request";

import SVGCache from "helpers/svg";
import { FORMATTERS } from "helpers/formatters";

import SvgImage from "components/SvgImage";

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
      
    if(this.props.type=="region"){
      this.cache.setSvg(
        "/images/maps/zoom/comunas-" + this.props.code + ".svg",
        xml
      );
      this.setState(
        {
          svgFile: xml
        }
      );
    }
  }

  componentDidMount() {
    if(this.props.type=="region"){
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
    if (props.nextProps=="region" && (nextProps.code !== this.props.code)) {
      loadSvgAsString(
        "/images/maps/zoom/comunas-" + this.props.code + ".svg"
      ).get(this.callbackSvg);
    }
  }


  render() {
      const { t, datum, type, title, code, source, className } = this.props;

      return (
          <div className={"featured-datum-splash featured-map-splash " + className}>
              <h4 className="featured-datum-splash-title">
                  {title}
              </h4>
              <div className="featured-datum-splash-icons">
                 
                { 
                  type && type=="region" &&
                  <div className="svg-mini-map"
                      ref="svgcontainer"
                      dangerouslySetInnerHTML={{ __html: this.state.svgFile }}
                    />
                } 

                { 
                  type && type=="country" &&
                  <SvgImage
                          extraClass="full"
                          src={`/images/splash-icon/icon-ingreso-full.svg`}
                      />
                } 

              </div>
              <div className="featured-datum-splash-data">
                  <p className="featured-datum-data">
                      {datum}
                  </p>
              </div>
              <h6 className="featured-datum-splash-source">
                  {source}
              </h6>
          </div>
      );
  }
}

export default translate()(connect(state => ({}), {})(FeaturedMapSplash));
