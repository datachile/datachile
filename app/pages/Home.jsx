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
                      {t("about.data.matricula.title")}
                    </span>
                    <span className="source">
                      {t("about.data.matricula.source")}
                    </span>
                  </div>
                  <div className="dataset">
                    <span className="name">{t("about.data.psu.title")}</span>
                    <span className="source">{t("about.data.psu.source")}</span>
                  </div>
                </div>

                <div className="r-col">
                  <div className="dataset">
                    <span className="name">
                      {t("about.data.empleabilidad.title")}
                    </span>
                    <span className="source">
                      {t("about.data.empleabilidad.source")}
                    </span>
                  </div>
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
                    <span className="name">{t("about.data.gasto.title")}</span>
                    <span className="source">
                      {t("about.data.gasto.source")}
                    </span>
                  </div>
                </div>
              </div>
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
