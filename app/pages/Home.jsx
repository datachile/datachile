import React, { Component } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import { translate } from "react-i18next";

import FeaturedBox from "components/FeaturedBox";
import Nav from "components/Nav";
import Search from "components/Search";
import DynamicHomeHeader from "components/DynamicHomeHeader";

import "./Home.css";
import "../../node_modules/slick-carousel/slick/slick.css";

class Home extends Component {
  static need = [DynamicHomeHeader];

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
        explore: "/explore/countries",
        colors: ["#1bc4d3", "#3f93a0", "#31999B"],
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

  render() {
    const { t } = this.props;

    const { profiles, header, focus } = this.state;

    const changeProfileHeader = p => {
      this.setState({ header: p });
    };

    return (
      <CanonComponent id="home" data={this.props.data} topics={[]}>
        <div className="home">
          <Nav />

          <div className="splash">
            {profiles &&
              profiles.map((p, i) => (
                <div
                  className={
                    p.slug == this.state.header.slug
                      ? "selected image bg-" + p.slug
                      : "image bg-" + p.slug
                  }
                  id={p.slug}
                  key={i}
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
                <Search className="search-home" limit={5} />
              </div>
            </div>

            <div className="home-header">
              <DynamicHomeHeader header={header} />
            </div>
          </div>

          <div className="home-slider">
            {profiles &&
              profiles.map((p, i) => (
                <div
                  id={`home-slide-${p.slug}`}
                  key={i}
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
                        <img src={`/images/icons/icon-${p.slug}.svg`} />
                        <span>{p.name}</span>
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="home-featured-profiles">
            <h2>{t("Explore Featured Profiles")}</h2>
            <div className="home-featured-tiles">
              {focus &&
                focus.map((f, i) => (
                  <FeaturedBox
                    item={f}
                    className="home-featured-profile"
                    key={i}
                  />
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
      focus: state.focus,
      data: state.data
    }),
    {}
  )(Home)
);
