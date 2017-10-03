import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { SubNav } from "datawheel-canon";

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
      ancestor,
      exploreLink,
      ancestorLink,
      topics
    } = this.props;

    const currentLang = i18n.language.split("-")[0];
    const otherLang = currentLang === "es" ? "en" : "es";

    const {subnav_visible} = this.state;

    var canUseDOM = !!(
      typeof window !== "undefined" &&
      window.document &&
      window.document.createElement
    );

    //disgusting code, just to trigger the menu on subnav canon. Remove when is fixed
    if(canUseDOM){
      setTimeout(function(){
        window.dispatchEvent(new Event('scroll'));
      },100);      
    }

    var url = location.href;
    if (canUseDOM) {
      url = window.location.href;
    }
    url = url.replace(currentLang, otherLang);

    return (
      <nav className="nav">
        
        <SubNav type="scroll" anchor="left" visible={this.visibleSubNav}>
          <div className="close-btn-container">
            <div className="menu-button">
              <a onClick={this.toggleSubNav}>
                {subnav_visible?'X':'='}
              </a>
            </div>
          </div>
          <ul>
            <li className="title">
              {t('Navigation')}
            </li>
            <li className="lang-selector">
                <span className="lang-current">
                  {currentLang}
                </span>
                <span> | </span>
                <span className="lang-other">
                  <a href={url}>
                    {otherLang}
                  </a>
                </span>
            </li>
            <li className="link">
              <Link to="/explore">
                {t("Explore")}
              </Link>
            </li>
            {topics && topics.length>0 &&
              <li className="title">
                {t('Topics')}
              </li>
            }
          </ul>
        </SubNav>

        <div className="nav-container">
          <div className="nav-links">
            <div className="nav-lang">
              <div className="lang-selector">
                <span className="lang-current">
                  {currentLang}
                </span>
                <span> | </span>
                <span className="lang-other">
                  <a href={url}>
                    {otherLang}
                  </a>
                </span>
              </div>
            </div>
            <div className="nav-menu">
              <Link className="logo" to="/">
                <img src="/images/logos/logo-datachile.svg" />
              </Link>
              <Link className="link" to="/explore">
                {t("Explore")}
              </Link>
              <div className="menu-button">
                <a onClick={this.toggleSubNav}>
                  {subnav_visible?'=':'='}
                </a>
              </div>
            </div>
          </div>
          <div className="nav-title">
            <div className="type">
              {type &&
                exploreLink &&
                <Link className="link" to={exploreLink}>
                  {type}
                </Link>}
              {type &&
                !exploreLink &&
                <span>
                  {type}
                </span>}
            </div>
            <h1>
              {title}
            </h1>
            {ancestor &&
              <div className="parent">
                <Link className="link" to={ancestorLink}>{ancestor}</Link>
              </div>}
          </div>
        </div>
      </nav>
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
