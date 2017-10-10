import React, { Component } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import Slider from "react-slick";
import { translate } from "react-i18next";
import { Link } from "react-router";
import { select, selectAll, event } from "d3-selection";

import { GEO } from "helpers/dictionary";
import { GEOMAP } from "helpers/GeoData";

import FeaturedBox from "components/FeaturedBox";
import SourceNote from "components/SourceNote";
import Nav from "components/Nav";
import Search from "components/Search";
import DynamicHomeHeader from "components/DynamicHomeHeader";

import "./Home.css";
import "../../node_modules/slick-carousel/slick/slick.css";

class Home extends Component {
  static need = [];

  constructor (props) {
    super(props);
    const { t } = props;

    const profiles = [
        {name:t('Geo'), explore:'/explore/geo', colors:['#445e81','#263b58'], slug: 'geo', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo.')},
        {name:t('Countries'), explore:'/explore/coutries', colors:['#ccc','#ddd'], slug: 'countries', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo.')},
        {name:t('Institutions'), explore:'/explore/institutions', colors:['#595a8f','#393a6a'], slug: 'institutions', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo.')},
        {name:t('Careers'), explore:'/explore/careers', colors:['#676258','#9b8365'], slug: 'careers', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo.')},
        {name:t('Products'), explore:'/explore/products', colors:['#a45c58','#794f57'], slug: 'products', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo.')},
        {name:t('Industries'), explore:'/explore/industries', colors:['#0b5151','#143e48'], slug: 'industries', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempon.')}
      ];
    this.state = {
      profiles: profiles,
      header: profiles[0],
      selected: 0
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.warn('componentWillReceiveProps',nextState.header);
    //this.paintMountains(nextProps.header);
    /*if (nextProps && nextProps.header && (nextProps.header.slug !== this.props.header.slug)) {
      loadSvgAsString(
        "/images/home/headers/" + this.state.header.slug + ".svg"
      ).get(this.callbackSvg);
    }*/
  }

  changeBg() {
    const id = this.state.header.slug;
    select('.home .splash .image')
      .transition()
      .duration(500)
      .style("opacity",0)
      .on("end", function(e) {
        select('.home .splash .image#'+id)
          .transition()
          .duration(500)
          .style('opacity',1);
      });
  }

  render() {
    const { focus, message, t } = this.props;

//    const featured = focus.map(f => GEOMAP.getRegion(f));

    const { profiles, header, selected } = this.state; 



    const afterChangeSlider = d => {
    };

    const beforeChangeSlider = d => {
    };

    const changeProfileHeader = p => {
      console.warn('changeProfileHeader', p);
      this.setState({header:p}, () => {
        //this.changeBg();
      });
    };

    var settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 2,
      adaptiveHeight: true,
      lazyLoad: false
    };

    return (
      <CanonComponent id="home" data={this.props.data} topics={[]}>
        <div className="home">
          <Nav />
          
          <div className="splash">
            { profiles && profiles.map((p) =>
              <div className={(p.slug==this.state.header.slug)?'selected image':'image'} id={p.slug} style={{'backgroundImage':'url(/images/home/bg/'+this.state.header.slug+'.png)'}} />
            )}
            <div className="gradient" />
          </div>
          
          <div className="intro">
            <div className="text">
              <h2 className="title">
                <span>Data Chile</span>
              </h2>
              <p className="lead">
                {t(
                  "Interactive data visualization platform about Chilean public data"
                )}
              </p>
            </div>
            <div className="search-home-wrapper">
              <Search className="search-home" local={true} limit={5} />
            </div>
          </div>

          <div className="home-header">
            <DynamicHomeHeader header={header} />
          </div>

          <div className="home-slider">
            <Slider
              {...settings}
              slickGoTo={selected}
              afterChange={afterChangeSlider}
              beforeChange={beforeChangeSlider}>
              { profiles && profiles.map((p) => 
                  
                  <div id="home-slide-{p.slug}" className="home-slide-item">
                    <div className="home-slide-content">
                      <div className="home-slide-clickable" onClick={() => changeProfileHeader(p)}>
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                      </div>
                      <Link className="link" to={p.explore}>
                        {t("Explore profiles")}
                      </Link>
                    </div>
                  </div>

              )}
            </Slider>
          </div>


        </div>
      </CanonComponent>
    );
  }
}

export default translate()(
  connect(
    state => ({
      focus: state.focus
    }),
    {}
  )(Home)
);
