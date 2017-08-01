import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import "./Nav.css";

class Nav extends Component {
  render() {
    const { t, i18n, location } = this.props;

    const currentLang = i18n.language.split("-")[0];
    const otherLang = currentLang === "es" ? "en" : "es";

    var canUseDOM = !!(
      typeof window !== "undefined" &&
      window.document &&
      window.document.createElement
    );

    var url = location.href;
    if (canUseDOM) {
      console.log("window existe!!!");
      url = window.location.href;
    }
    url = url.replace(currentLang, otherLang);

    console.log(currentLang, otherLang, url);

    return (
      <nav className="nav">
        <div className="dc-container nav-container">
          <div className="nav-links">
            <Link className="logo" to="/">
              <img src="/images/logos/logo-datachile.svg" />
            </Link>
          </div>
          <div className="nav-links">
            <Link className="link" to="/">
              {t("Home")}
            </Link>
            <Link className="link" to="/explore">
              {t("Explore")}
            </Link>
            <div className="lang-selector">
              <span>
                {t("lang_" + currentLang)}
              </span>
              <span>
                <a href={url}>
                  {t("lang_" + otherLang)}
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
