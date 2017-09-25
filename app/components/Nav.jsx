import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { slugifyItem } from "helpers/formatters";
import "./Nav.css";

class Nav extends Component {
  render() {
    const {
      t,
      i18n,
      location,
      title,
      type,
      ancestor,
      exploreLink,
      ancestorLink
    } = this.props;

    const currentLang = i18n.language.split("-")[0];
    const otherLang = currentLang === "es" ? "en" : "es";

    var canUseDOM = !!(
      typeof window !== "undefined" &&
      window.document &&
      window.document.createElement
    );

    var url = location.href;
    if (canUseDOM) {
      url = window.location.href;
    }
    url = url.replace(currentLang, otherLang);

    return (
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-links">
            <Link className="logo" to="/">
              <img src="/images/logos/logo-datachile.svg" />
            </Link>
            <Link className="link" to="/explore">
              {t("Explore")}
            </Link>
          </div>
          <div className="nav-title">
            <h1>
              {title}
            </h1>
            {ancestor &&
              <div className="parent">
                <Link className="link" to={ancestorLink}>{ancestor}</Link>
              </div>}
          </div>
          <div className="nav-meta">
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
            
          </div>
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
