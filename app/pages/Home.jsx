import React, { Component } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import Slider from "react-slick";
import { translate } from "react-i18next";
import { Link } from "react-router";

import { GEO } from "helpers/dictionary";
import { GEOMAP } from "helpers/GeoData";

import FeaturedBox from "components/FeaturedBox";
import SourceNote from "components/SourceNote";
import Nav from "components/Nav";
import Search from "components/Search";

import "./Home.css";
import "../../node_modules/slick-carousel/slick/slick.css";

class Home extends Component {
  static need = [];

  constructor (props) {
    super(props);
    const { t } = props;

    const profiles = [
        {name:t('Geo'), explore:'/explore/geo', color:'', slug: '', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo.')},
        {name:t('Countries'), explore:'/explore/coutries', color:'', slug: '', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo.')},
        {name:t('Institutions'), explore:'/explore/institutions', color:'', slug: '', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo.')},
        {name:t('Careers'), explore:'/explore/careers', color:'', slug: '', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo.')},
        {name:t('Products'), explore:'/explore/products', color:'', slug: '', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo.')},
        {name:t('Industries'), explore:'/explore/industries', color:'', slug: '', description:t('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempon.')}
      ];
    this.state = {
      profiles: profiles,
      header: profiles[0],
      selected: 0,
    };
  }

  render() {
    const { focus, message, t } = this.props;

//    const featured = focus.map(f => GEOMAP.getRegion(f));

    const { profiles, header, selected } = this.state; 

    const afterChange = d => {
    };

    const beforeChange = d => {
    };

    const changeProfileHeader = p => {
      console.log('changeProfileHeader', p);
      this.setState({header:p});
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
            <div className="image" />
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
            <h2>HEADER + ILLUSTRATION {header.name}</h2>
          </div>

          <div className="home-slider">
            <Slider
              {...settings}
              slickGoTo={selected}
              afterChange={afterChange}
              beforeChange={beforeChange}>
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
