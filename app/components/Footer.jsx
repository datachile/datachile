import React, {Component} from "react";
import {Link} from "react-router";
import {translate} from "react-i18next";
import "./Footer.css";


class Footer extends Component {

  render() {
    const {t} = this.props;

    return (
        <footer>
            <div className="dc-container footer-container">
                <div className="logos">
                    <p className="collaboration">{ t('Created in collaboration') }</p>
                    <img className="logo-datawheel" src="/images/logos/logo-datawheel.png" />
                    <img className="logo" src="/images/logos/logo-asech.svg" />
                    <img className="logo" src="/images/logos/logo-antofagasta-minerals.svg" />
                    <img className="logo" src="/images/logos/logo-corfo.svg" />
                    <img className="logo" src="/images/logos/logo-gob.png" />
                </div>

                <div className="nav-links">
                    <Link className="link" to="/">{ t("Home") }</Link>
                    <span className="link link-dot">&#183;</span>
                    <Link className="link" to="/explore">{ t("Explore") }</Link>
                    <span className="link link-dot">&#183;</span>
                    <Link className="link" to="/profiles">{ t("Profiles") }</Link>
                    <span className="link link-dot">&#183;</span>
                    <Link className="link" to="/topics">{ t("Topics") }</Link>
                    <span className="link link-dot">&#183;</span>
                    <Link className="link" to="/about">{ t("About") }</Link>
                    <span className="link link-dot">&#183;</span>
                    <Link className="link" to="/contact">{ t("Contact") }</Link>
                    <span className="link link-dot">&#183;</span>
                </div>
            </div>
        </footer>
    );
  }
}

export default translate()(Footer);
