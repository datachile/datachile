import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
import "./Footer.css";

class Footer extends Component {
    render() {
        const { t } = this.props;

        return (
            <footer>
                <div className="footer-container">
                    <p className="collaboration">
                        {t("Created in collaboration")}
                        <span className="line" />
                    </p>
                    <div className="logos">
                        <img
                            className="logo-datawheel"
                            src="/images/logos/logo-datawheel.png"
                        />
                        <img
                            className="logo"
                            src="/images/logos/logo-antofagasta-minerals.svg"
                        />
                        <img
                            className="logo"
                            src="/images/logos/logo-asech.svg"
                        />
                        <img
                            className="logo"
                            src="/images/logos/logo-corfo.svg"
                        />
                        <img
                            className="logo"
                            src="/images/logos/logo-minecon.png"
                        />
                        <img
                            className="logo"
                            src="/images/logos/logo-direcon.png"
                        />
                    </div>

                    <div className="nav-links">
                        <Link className="link" to="/">
                            {t("Home")}
                        </Link>
                        <span className="link link-dot">&#183;</span>
                        <Link className="link" to="/explore/geo">
                            {t("Regions & Comunas")}
                        </Link>
                        <span className="link link-dot">&#183;</span>
                        <Link className="link" to="/explore/industries">
                            {t("Industries")}
                        </Link>
                        <span className="link link-dot">&#183;</span>
                        <Link className="link" to="/explore/institutions">
                            {t("Institutions")}
                        </Link>
                        <span className="link link-dot">&#183;</span>
                        <Link className="link" to="/explore/careers">
                            {t("Careers")}
                        </Link>
                        <span className="link link-dot">&#183;</span>
                        <Link className="link" to="/explore/products">
                            {t("Products")}
                        </Link>
                        <span className="link link-dot">&#183;</span>
                        <Link className="link" to="/explore/industries">
                            {t("Industries")}
                        </Link>
                        <span className="link link-dot">&#183;</span>
                        <Link className="link" to="/explore/map">
                            {t("Map")}
                        </Link>
                        <span className="link link-dot">&#183;</span>
                        <Link className="link" to="/about">
                            {t("About")}
                        </Link>
                        <span className="link link-dot">&#183;</span>
                        <a className="link" href="#" target="_blank">
                            {t("Contact")}
                        </a>
                    </div>
                </div>
            </footer>
        );
    }
}

export default translate()(Footer);
