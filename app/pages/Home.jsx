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
import CustomPrevArrow from "components/CustomPrevArrow";
import CustomNextArrow from "components/CustomNextArrow";

import "./Home.css";
import "../../node_modules/slick-carousel/slick/slick.css";

class Home extends Component {
  static need = [];

  constructor(props) {
    super(props);
    const { t, focus } = props;

    const profiles = [
      {
        name: t("Geographical"),
        explore: "/explore/geo",
        colors: ["#445e81", "#263b58", "#1B2E44"],
        slug: "geo",
        description: t(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo."
        )
      },
      {
        name: t("Countries"),
        explore: "/explore/coutries",
        colors: ["#ccc", "#ddd", "eee"],
        slug: "countries",
        description: t(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        )
      },
      {
        name: t("Institutions"),
        explore: "/explore/institutions",
        colors: ["#595a8f", "#393a6a", "#393954"],
        slug: "institutions",
        description: t(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo. Lorem ipsum dolor sit amet."
        )
      },
      {
        name: t("Careers"),
        explore: "/explore/careers",
        colors: ["#676258", "#9b8365", "#776551"],
        slug: "careers",
        description: t("Lorem ipsum dolor sit amet, consectetur .")
      },
      {
        name: t("Products"),
        explore: "/explore/products",
        colors: ["#a45c58", "#794f57", "#91453B"],
        slug: "products",
        description: t(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo."
        )
      },
      {
        name: t("Industries"),
        explore: "/explore/industries",
        colors: ["#0b5151", "#143e48", "#205258"],
        slug: "industries",
        description: t(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempon."
        )
      }
    ];
    this.state = {
      profiles: profiles,
      header: profiles[0],
      selected: 0,
      focus: focus
    };
  }

  componentWillReceiveProps(nextProps, nextState) {}

  render() {
    const { message, t } = this.props;

    const { profiles, header, selected, focus } = this.state;

    const afterChangeSlider = d => {};

    const beforeChangeSlider = d => {};

    const changeProfileHeader = p => {
      this.setState({ header: p });
    };

    var settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 2,
      adaptiveHeight: true,
      lazyLoad: false,
      prevArrow: <CustomPrevArrow />,
      nextArrow: <CustomNextArrow />
    };

    return (
      <CanonComponent id="home" data={this.props.data} topics={[]}>
        <div className="home">
          <Nav />

          <div className="splash">
            {profiles &&
              profiles.map(p => (
                <div
                  className={
                    p.slug == this.state.header.slug
                      ? "selected image"
                      : "image"
                  }
                  id={p.slug}
                  style={{
                    backgroundImage:
                      "url(/images/home/bg/" + this.state.header.slug + ".jpg)"
                  }}
                />
              ))}
            <div className="gradient" />

            <div className="intro">
              <div className="text">
                <h1 className="title">
                  <span>DATACHILE</span>
                </h1>
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
          </div>

          <div className="home-slider">
            <Slider
              {...settings}
              slickGoTo={selected}
              afterChange={afterChangeSlider}
              beforeChange={beforeChangeSlider}
            >
              {profiles &&
                profiles.map(p => (
                  <div
                    id={`home-slide-${p.slug}`}
                    className={
                      p.slug == header.slug
                        ? "home-slide-item selected"
                        : "home-slide-item"
                    }
                  >
                    <span
                      className={`home-slide-selected background-${p.slug}`}
                    />
                    <div className={`home-slide-content border-${p.slug}`}>
                      <div
                        className="home-slide-clickable"
                        onClick={() => changeProfileHeader(p)}
                      >
                        <h3>
                          <img src={`/images/icons/icon-${p.slug}.svg`} />{" "}
                          {p.name}
                        </h3>
                        <p>{p.description}</p>
                      </div>
                      <Link className={`link color-${p.slug}`} to={p.explore}>
                        {t("Explore profiles")}{" "}
                        <span className="pt-icon pt-icon-chevron-right" />
                      </Link>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>

          <div className="home-featured-profiles">
            <h2>{t("Explore Featured Profiles")}</h2>
            <div className="home-featured-tiles">
              {focus &&
                focus.map(f => (
                  <FeaturedBox item={f} className="home-featured-profile" />
                ))}
            </div>
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
