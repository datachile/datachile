import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { SubNav } from "datawheel-canon";

import NavFixed from "components/NavFixed";
import { slugifyItem } from "helpers/formatters";

import "./Nav.css";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subnav_visible: false
    };
    this.toggleSubNav = this.toggleSubNav.bind(this);
    this.visibleSubNav = this.visibleSubNav.bind(this);
  }

  toggleSubNav() {
    this.setState(prevState => ({
      subnav_visible: !prevState.subnav_visible
    }));
  }

  visibleSubNav() {
    return this.state.subnav_visible;
  }

  render() {
    const {
      t,
      i18n,
      location,
      title,
      type,
      typeTitle,
      ancestor,
      exploreLink,
      ancestorLink,
      topics
    } = this.props;

    if (!i18n.language) return null;

    const currentLang = i18n.language.split("-")[0];
    const otherLang = currentLang === "es" ? "en" : "es";

    const { subnav_visible } = this.state;

    var canUseDOM = !!(
      typeof window !== "undefined" &&
      window.document &&
      window.document.createElement
    );

    //disgusting code, just to trigger the menu on subnav canon. Remove when is fixed
    if (canUseDOM) {
      setTimeout(function() {
        window.dispatchEvent(new Event("scroll"));
      }, 100);
    }

    var url = location.href;
    if (canUseDOM) {
      url = window.location.href;
    }
    url = url.replace(currentLang, otherLang);

    return (
      <div id="navs-container">
        <nav className="nav">
          <SubNav type="scroll" anchor="left" visible={this.visibleSubNav}>
            <div className="close-btn-container">
              <div className="menu-button">
                <a onClick={this.toggleSubNav}>
                  <img src="/images/icons/icon-close.svg" />
                </a>
              </div>
            </div>
            <ul>
              <li className="title">{t("Navigation")}</li>
              <li className="lang-selector">
                <span className="lang-current">{currentLang}</span>
                <span> | </span>
                <span className="lang-other">
                  <a href={url}>{otherLang}</a>
                </span>
              </li>
              <li className="link">
                <Link to="/explore/geo">{t("Explore")}</Link>
              </li>
              <li className="link">
                <Link to="/about">{t("About")}</Link>
              </li>
              {topics &&
                topics.length > 0 && <li className="title">{t("Topics")}</li>}
            </ul>
          </SubNav>

          <div className="nav-container">
            <div className="l-col">
              <div className="menu-button">
                <a onClick={this.toggleSubNav}>
                  <img src="/images/icons/icon-menu.svg" />
                </a>
              </div>
            </div>

            <div className="c-col">
              <Link className="logo" to="/">
                <img src="/images/logos/logo-datachile.png" />
              </Link>
            </div>

            <div className="r-col">
              <div className="nav-lang">
                <div className="lang-selector">
                  <span className="lang-current">{currentLang}</span>
                  <span> | </span>
                  <span className="lang-other">
                    <a href={url}>{otherLang}</a>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="title-container">
            <div className="nav-title">
              <h1>{title}</h1>
              <div className="meta-title">
                <div className="type">
                  {typeTitle &&
                    exploreLink && (
                      <Link className="link" to={exploreLink}>
                        {type && (
                          <span className="icon-container">
                            <img
                              className="icon"
                              src={`/images/icons/icon-${type}.svg`}
                            />
                          </span>
                        )}
                        <span>{typeTitle}</span>
                      </Link>
                    )}
                  {type && !exploreLink && <span>{typeTitle}</span>}
                </div>
                {ancestor && (
                  <div className="parent">
                    <span className="separator">|</span>
                    <Link className="link" to={ancestorLink}>
                      {ancestor}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <NavFixed
          topics={topics}
          title={title}
          toggleSubNav={this.toggleSubNav}
        />
      </div>
    );
  }
}

export default translate()(
  connect(
    state => ({
      location: state.location
    }),
    {}
  )(Nav)
);
