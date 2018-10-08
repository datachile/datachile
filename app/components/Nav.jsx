import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { SubNav } from "datawheel-canon";
import { select } from "d3-selection";

import NavFixed from "components/NavFixed";
import Search from "components/Search";
import ComingSoon from "components/ComingSoon";

import "./Nav.css";

class Nav extends Component {
  state = {
    subnav_visible: false,
    search_visible: false
  };

  toggleSubNav = () => {
    this.setState(prevState => ({
      subnav_visible: !prevState.subnav_visible
    }));
  };

  toggleSearch = () => {
    this.setState(prevState => ({
      search_visible: !prevState.search_visible
    }));
  };

  refSubNav = instance => {
    if (instance) this._nodeSubNav = instance.container;
  };

  manageOutsideClick = evt => {
    const subnav = this._nodeSubNav;
    if (!subnav.isSameNode(evt.target) && !subnav.contains(evt.target))
      this.setState({ subnav_visible: false });
  };

  componentDidMount() {
    document.addEventListener("click", this.manageOutsideClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.manageOutsideClick, true);
  }

  render() {
    const {
      t,
      i18n,
      title,
      type,
      typeTitle,
      ancestor,
      exploreLink,
      ancestorLink,
      topics,
      dark
    } = this.props;

    let { fullTitle } = this.props;

    const locale = i18n.language;

    const otherLang = locale === "es" ? "en" : "es";

    const { subnav_visible, search_visible } = this.state;

    const search_icon = search_visible ? "icon-close-black" : "icon-search";

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

    var location = canUseDOM ? window.location : this.props.location;

    var url = location.origin.replace(locale, otherLang) + location.pathname;
    var isHomePage = location.pathname === "/";

    if (canUseDOM) {
      const nodeSide = select(".search-sidebar input").node();
      if (nodeSide) {
        if (subnav_visible) {
          nodeSide.focus();
        } else {
          nodeSide.blur();
        }
      }
      const nodeNav = select(".search-nav-main input").node();
      if (nodeNav) {
        if (search_visible) {
          nodeNav.focus();
        } else {
          nodeNav.blur();
        }
      }
    }

    const darkClass = dark ? "nav-dark" : "";

    // catch for missing fullTitle (i.e., NotFound.jsx)
    !fullTitle ? (fullTitle = title) : null;

    let showMeta = true;
    if (url.includes("/explore/") || url.includes("/about")) {
      showMeta = false;
    }

    return (
      <div className="main-nav-container" id="navs-container">
        <nav className={`nav ${darkClass}`}>
          <SubNav
            type="scroll"
            anchor="left"
            visible={subnav_visible}
            ref={this.refSubNav}
          >
            <div className="button-set-container">
              <a
                className="menu-close-btn"
                onClick={this.toggleSubNav}
              >
                <img src="/images/icons/icon-close.svg" />
              </a>
              { isHomePage ?
                <div className="home-link is-active">
                  <img
                    className="home-link-img"
                    src="/images/logos/datachile-beta-navbar.svg"
                    alt=""
                  />
              </div>
                : <Link className="home-link" to="/">
                  <img
                    className="home-link-img"
                    src="/images/logos/datachile-beta-navbar.svg"
                    alt="home"
                  />
                </Link>
              }
              <div className="lang-selector">
                <span className="lang current">{locale}</span>
                |
                <a className="lang other" href={url}>
                  {otherLang}
                </a>
              </div>
            </div>

            <div className={`search-nav-wrapper`}>
              <Search className="search-nav search-sidebar" />
            </div>

            <h2 className="u-visually-hidden">Navigation</h2>

            {/* profile nav */}
            <h3 className="subnav-subtitle font-sm">{t("Profiles")}</h3>
            <ul className="subnav-list">
              <li className="subnav-item">
                <Link
                  className="subnav-link subhead border-geo color-geo-hover"
                  to="/explore/geo"
                  onClick={this.toggleSubNav}
                >
                  Chile
                </Link>
              </li>
              <li className="subnav-item">
                <Link
                  className="subnav-link subhead border-countries color-countries-hover"
                  to="/explore/countries"
                  onClick={this.toggleSubNav}
                >
                  {t("Countries")}
                </Link>
              </li>
              <li className="subnav-item">
                <Link
                  className="subnav-link subhead border-products color-products-hover"
                  to="/explore/products"
                  onClick={this.toggleSubNav}
                >
                  {t("Products")}
                </Link>
              </li>
              <li className="subnav-item">
                <Link
                  className="subnav-link subhead border-industries color-industries-hover"
                  to="/explore/industries"
                  onClick={this.toggleSubNav}
                >
                  {t("Industries")}
                </Link>
              </li>
              <li className="subnav-item link-soon">
                <div className="subnav-link subhead" to="">
                  {t("Careers")}
                  <ComingSoon />
                </div>
              </li>
              <li className="subnav-item link-soon">
                <div className="subnav-link subhead" to="">
                  {t("Institutions")}
                  <ComingSoon />
                </div>
              </li>
              <li className="subnav-item link-soon">
                <div className="subnav-link subhead" to="">
                  {t("Map")}
                  <ComingSoon />
                </div>
              </li>
            </ul>


            {/* sitewide nav */}
            <h3 className="subnav-subtitle font-sm">{t("About")}</h3>
            <ul className="subnav-list">
              <li className="subnav-item">
                <Link
                  className="subnav-link subhead"
                  to="/about"
                  onClick={this.toggleSubNav}
                >
                  {t("About DataChile")}
                </Link>
              </li>
            </ul>


            {/* subnav */}
            {topics &&
              <h3 className="subnav-subtitle font-sm">{t("Topics")}</h3>
            }
          </SubNav>

          <div className="nav-container">
            <div className="l-col">
              {/* menu toggle */}
              <div className="menu-button">
                <a className="menu-open-btn" onClick={this.toggleSubNav}>
                  <span className="u-visually-hidden">main menu and search</span>
                  <img src="/images/icons/icon-menu.svg" />
                </a>
              </div>
              {/* logo */}
              {!isHomePage && (
                <Link className="logo" to="/">
                  <img src="/images/logos/datachile-beta-navbar.svg" alt="home" />
                </Link>
              )}
            </div>

            <div
              className={`r-col nav-search ${
                search_visible ? "open" : "closed"
              }`}
            >
              {/* mobile search - triggers nav */}
              <a
                className="nav-search-toggle toggle-nav"
                onClick={this.toggleSubNav}
              >
                <img
                  className="nav-search-icon"
                  src={`/images/icons/${search_icon}.svg`}
                />
              </a>
              {/* desktop search with label */}
              <div className="nav-search-container">
                <a
                  className="nav-search-toggle toggle-input"
                  onClick={this.toggleSearch}
                >
                  <span className="nav-search-label label font-xs">{t("SearchLabel")}</span>
                  <img
                    className="nav-search-icon"
                    src={`/images/icons/${search_icon}.svg`}
                  />
                </a>
                <div className="nav-search-wrapper">
                  <Search className="search-nav search-nav-main" />
                </div>
              </div>
            </div>
          </div>

          {(title || typeTitle || type || ancestor) && (
            <div className="title-container">
              <div className="nav-title">
                <h1>
                  {/* truncated title, hidden from screen readers */}
                  <span aria-hidden>{title}</span>
                  {/* full title for screen readers, hidden from screen */}
                  <span className="u-visually-hidden">{fullTitle}</span>
                </h1>
                { showMeta &&
                  <p className="meta-title">
                    {type &&
                      <span className="type">
                        {typeTitle &&
                          exploreLink && (
                            <Link
                              className={`category color-${type}`}
                              to={exploreLink}
                            >
                              {type && (
                                <img
                                  className="category-icon"
                                  src={`/images/icons/icon-${type}.svg`}
                                />
                              )}
                              {typeTitle}
                            </Link>
                          )}
                        {type && !exploreLink && <span>{typeTitle}</span>}
                      </span>
                    }
                    {type && ancestor && (
                      <span className="parent">
                        <span className="separator">{t("in")}</span>
                        <Link className="link" to={ancestorLink}>
                          {ancestor}
                        </Link>
                      </span>
                    )}
                  </p>
                }
              </div>
            </div>
          )}
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

const mapStateToProps = state => {
  return {
    location: state.location
  };
};

export default translate()(connect(mapStateToProps)(Nav));
