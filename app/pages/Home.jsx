import React, { Component } from "react";
import { connect } from "react-redux";
import { Canon, CanonProfile } from "datawheel-canon";
import { translate } from "react-i18next";
import { Link } from "react-router";
import Helmet from "react-helmet";

import { featured_profiles } from "helpers/consts";

import FeaturedBox from "components/FeaturedBox";
import Nav from "components/Nav";

import Search from "components/Search";
import DynamicHomeHeader from "components/DynamicHomeHeader";
import ProfileCarousel from "components/ProfileCarousel";

import {
  needHomeComunasExports,
  needHomeComunasPopulation,
  needHomeProductsExports,
  needHomeCountriesExports
} from "./home_needs";

import "./Home.css";
import "../../node_modules/slick-carousel/slick/slick.css";

class Home extends Component {
  static need = [
    DynamicHomeHeader,
    needHomeComunasExports,
    needHomeComunasPopulation,
    needHomeProductsExports,
    needHomeCountriesExports
  ];

  constructor(props) {
    super(props);
    const { t, focus } = props;

    const profiles = [
      {
        name: t("Geographical"),
        explore: "/explore/geo",
        colors: ["#445e81", "#263b58", "#1B2E44"],
        slug: "geo",
        available: true
      },
      {
        name: t("Countries"),
        explore: "/explore/countries",
        colors: ["#1bc4d3", "#3f93a0", "#31999B"],
        slug: "countries",
        available: true
      },
      {
        name: t("Products"),
        explore: "/explore/products",
        colors: ["#a45c58", "#794f57", "#91453B"],
        slug: "products",
        available: true
      },
      {
        name: t("Industries"),
        explore: "/explore/industries",
        colors: ["#0b5151", "#143e48", "#205258"],
        slug: "industries",
        available: true
      }
      // {
      //   name: t("Careers"),
      //   explore: "/explore/careers",
      //   colors: ["#676258", "#9b8365", "#776551"],
      //   slug: "careers",
      //   available: false
      // },
      // {
      //   name: t("Institutions"),
      //   explore: "/explore/institutions",
      //   colors: ["#595a8f", "#393a6a", "#393954"],
      //   slug: "institutions",
      //   available: false
      // }
    ];
    this.state = {
      profiles: profiles,
      header: profiles[0],
      selected: 0,
      focus: focus
    };
  }

  render() {
    const { t, i18n, location } = this.props;

    const locale = i18n.language;

    const featured = featured_profiles[locale]
      ? featured_profiles[locale]
      : featured_profiles["es"];

    const { profiles, header, focus } = this.state;

    const changeProfileHeader = p => {
      this.setState({ header: p });
    };

    const {
      home_comunas_population,
      home_comunas_exports,
      home_products_exports,
      home_countries_exports
    } = this.props.data;

    return (
      <Canon>
        <CanonProfile id="home" data={this.props.data} topics={[]}>
          <Helmet>
            <meta
              name="description"
              content={t(
                "The most comprehensive effort to integrate and visualize Chile’s Public Data"
              )}
            />
            <meta property="og:title" content={"DataChile"} />
            <meta
              property="og:url"
              content={`https://${locale}.datachile.io`}
            />
            <meta
              property="og:image"
              content={`https://${locale}.datachile.io/images/logos/opengraph.png`}
            />
          </Helmet>
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
                    <img
                      title="DataChile"
                      src="/images/logos/logo-dc-beta-small.svg"
                      alt="DataChile"
                    />
                    <Link
                      className="easter"
                      title=";)"
                      to="/geo/valparaiso-5/isla-de-pascua-115"
                      aria-hidden="true"
                    />
                    <span className="u-visually-hidden">
                      DataChile ({t("home")})
                    </span>
                  </h1>
                  <p className="lead">{t("home.subtitle")}</p>
                  <div className="search-home-wrapper">
                    <Search className="search-home" limit={5} />
                  </div>
                </div>
              </div>

              <div className="home-header">
                <DynamicHomeHeader
                  data={this.props.data}
                  router={this.props.router}
                  header={header}
                />
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
                      <button
                        className={`home-slide-btn u-btn-reset ${
                          p.slug == header.slug ? "selected" : ""
                        }`}
                        onClick={() => changeProfileHeader(p)}
                      >
                        <img
                          className="home-slide-icon"
                          src={`/images/icons/icon-${p.slug}.svg`}
                        />
                        <span className="home-slide-label">{p.name}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="home-content">
              {/* profiles */}
              <div className="home-featured-profiles">
                {/*<div className="home-section-title">
                  <div className="home-section-title-img">
                    <img src="/images/icons/icon-search.svg" alt="explore" />
                  </div>
                  <h2>{t("Explore")}</h2>
                </div>*/}
                <h2 className="u-visually-hidden">{t("Explore")}</h2>
                <div className="home-profile-carousels-container">
                  <ProfileCarousel
                    title={t("home.carousel.featured_profiles")}
                    type="star"
                    items={featured}
                    limit={5}
                  />
                  <ProfileCarousel
                    title={t("home.carousel.comunas_population")}
                    type="geo"
                    items={home_comunas_population}
                    limit={5}
                  />
                  <ProfileCarousel
                    title={t("home.carousel.comunas_exports")}
                    type="geo"
                    items={home_comunas_exports}
                    limit={5}
                  />
                  <ProfileCarousel
                    title={t("home.carousel.products_exports")}
                    type="products"
                    items={home_products_exports}
                    limit={5}
                  />
                  <ProfileCarousel
                    title={t("home.carousel.countries_exports")}
                    type="countries"
                    items={home_countries_exports}
                    limit={5}
                  />
                </div>

                {/* explore link */}
                <div className="home-btn-container u-text-center">
                  <Link className="btn" to="/explore/geo">
                    {t("Explore profiles")}
                    <span className="btn-icon pt-icon-standard pt-icon-chevron-right" />
                  </Link>
                </div>
              </div>

              {/* about section */}
              <div className="home-text">
                <div className="l-col">
                  <img src="/images/home/what.png" alt={t("home.what.title")} />
                  <h2>{t("home.what.title")}</h2>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t("home.what.text1")
                    }}
                  />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t("home.what.text2")
                    }}
                  />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t("home.what.text3")
                    }}
                  />
                </div>
                <div className="r-col">
                  <img src="/images/home/diff.png" alt={t("home.diff.title")} />
                  <h2>{t("home.diff.title")}</h2>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t("home.diff.text1")
                    }}
                  />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t("home.diff.text2")
                    }}
                  />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t("home.diff.text3")
                    }}
                  />
                </div>
              </div>

              {/* sources section */}
              <div className="home-sources">
                <div className="home-section-title">
                  <div className="home-section-title-img">
                    <img src="/images/icons/icon-source.svg" alt="sources" />
                  </div>
                  <h2>{t("home.sources.title")}</h2>
                </div>

                <div className="dataset-list">
                  <div className="l-col">
                    <div className="dataset">
                      <span className="name">
                        {t("about.data.casen.title")}
                      </span>
                      <span className="source">
                        {t("about.data.casen.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">{t("about.data.nene.title")}</span>
                      <span className="source">
                        {t("about.data.nene.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">{t("about.data.nesi.title")}</span>
                      <span className="source">
                        {t("about.data.nesi.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">
                        {t("about.data.enrollment.title")}
                      </span>
                      <span className="source">
                        {t("about.data.enrollment.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">{t("about.data.psu.title")}</span>
                      <span className="source">
                        {t("about.data.psu.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">
                        {t("about.data.aduana.title")}
                      </span>
                      <span className="source">
                        {t("about.data.aduana.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">
                        {t("about.data.muerte.title")}
                      </span>
                      <span className="source">
                        {t("about.data.muerte.source")}
                      </span>
                    </div>
                  </div>

                  <div className="r-col">
                    <div className="dataset">
                      <span className="name">
                        {t("about.data.salud.title")}
                      </span>
                      <span className="source">
                        {t("about.data.salud.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">{t("about.data.vida.title")}</span>
                      <span className="source">
                        {t("about.data.vida.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">
                        {t("about.data.migracion.title")}
                      </span>
                      <span className="source">
                        {t("about.data.migracion.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">
                        {t("about.data.discapacidad.title")}
                      </span>
                      <span className="source">
                        {t("about.data.discapacidad.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">
                        {t("about.data.iplusd.title")}
                      </span>
                      <span className="source">
                        {t("about.data.iplusd.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">
                        {t("about.data.performance.title")}
                      </span>
                      <span className="source">
                        {t("about.data.performance.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">
                        {t("about.data.poblacion.title")}
                      </span>
                      <span className="source">
                        {t("about.data.poblacion.source")}
                      </span>
                    </div>
                    <div className="dataset">
                      <span className="name">
                        {t("about.data.internet.title")}
                      </span>
                      <span className="source">
                        {t("about.data.internet.source")}
                      </span>
                    </div>
                  </div>

                  {/* more link */}
                  <div className="home-btn-container u-text-center">
                    <Link className="btn" to="/about/data">
                      {t("See more")}
                      <span className="btn-icon pt-icon-standard pt-icon-chevron-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CanonProfile>
      </Canon>
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
