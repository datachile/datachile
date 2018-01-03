import React, { Component } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import { translate } from "react-i18next";
import { Link } from "react-router";

import FeaturedBox from "components/FeaturedBox";
import Nav from "components/Nav";
import DatachileLoading from "components/DatachileLoading";
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
        available: true,
        description: t(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo."
        )
      },
      {
        name: t("Countries"),
        explore: "/explore/countries",
        colors: ["#1bc4d3", "#3f93a0", "#31999B"],
        slug: "countries",
        available: true,
        description: t(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        )
      },
      {
        name: t("Products"),
        explore: "/explore/products",
        colors: ["#a45c58", "#794f57", "#91453B"],
        slug: "products",
        available: true,
        description: t(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo."
        )
      },
      {
        name: t("Industries"),
        explore: "/explore/industries",
        colors: ["#0b5151", "#143e48", "#205258"],
        slug: "industries",
        available: true,
        description: t(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempon."
        )
      },
      {
        name: t("Careers"),
        explore: "/explore/careers",
        colors: ["#676258", "#9b8365", "#776551"],
        slug: "careers",
        available: false,
        description: t("Lorem ipsum dolor sit amet, consectetur .")
      },
      {
        name: t("Institutions"),
        explore: "/explore/institutions",
        colors: ["#595a8f", "#393a6a", "#393954"],
        slug: "institutions",
        available: false,
        description: t(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo. Lorem ipsum dolor sit amet."
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

    const {
      home_comunas_population,
      home_comunas_exports,
      home_products_exports,
      home_countries_exports
    } = this.props.data;

    return (
      <CanonComponent
        id="home"
        data={this.props.data}
        topics={[]}
        loadingComponent={<DatachileLoading />}
      >
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
                  />
                </h1>
                <p className="lead">{t("home.subtitle")}</p>
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

          <div className="home-content">
            <div className="home-text">
              <div className="l-col">
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

            <div className="home-featured-profiles">
              <div className="home-section-title">
                <div className="home-section-title-img">
                  <img src="/images/icons/icon-search.svg" alt="explore" />
                </div>
                <h2>{t("Explore")}</h2>
              </div>
              <div className="home-profile-carousels-container">
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
            </div>
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
                    <span className="name">{t("about.data.casen.title")}</span>
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
                    <span className="source">{t("about.data.psu.source")}</span>
                  </div>
                  <div className="dataset">
                    <span className="name">{t("about.data.aduana.title")}</span>
                    <span className="source">
                      {t("about.data.aduana.source")}
                    </span>
                  </div>
                  <div className="dataset">
                    <span className="name">{t("about.data.muerte.title")}</span>
                    <span className="source">
                      {t("about.data.muerte.source")}
                    </span>
                  </div>
                </div>

                <div className="r-col">
                  <div className="dataset">
                    <span className="name">{t("about.data.salud.title")}</span>
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
                    <span className="name">{t("about.data.iplusd.title")}</span>
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
              </div>
              <Link className="home-link" to="/about/data">
                {t("See more")}
              </Link>
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
