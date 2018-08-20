import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";

import ComingSoon from "components/ComingSoon";

import "./Footer.css";

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location, t } = this.props;

    // check whether we're on the home page
    const isHome = location.pathname === "/" ? true : false;
    console.log(isHome);

    // footer links
    const footerNavLinks = [
      {
        id: 1,
        text: t("Home"),
        link: "/",
        soon: false
      },
      {
        id: 2,
        text: t("About DataChile"),
        link: "/about",
        soon: false
      },
      {
        id: 3,
        text: t("Regions & Comunas"),
        link: "/explore/geo",
        soon: false
      },
      {
        id: 4,
        text: t("Countries"),
        link: "/explore/countries",
        soon: false
      },
      {
        id: 5,
        text: t("Products"),
        link: "/explore/products",
        soon: false
      },
      {
        id: 6,
        text: t("Industries"),
        link: "/explore/industries",
        soon: false
      },
      {
        id: 7,
        text: t("Careers"),
        link: "",
        soon: true
      },
      {
        id: 8,
        text: t("Institutions"),
        link: "",
        soon: true
      }
    ];
    const feedbackLinks = [
      {
        id: 1,
        link: "https://docs.google.com/forms/d/e/1FAIpQLSeSUbgmwnwb3yxr3PnttK6shv_JSNHnQGCDL9rPTl25ZZbW2A/viewform",
        text: t("form.error")
      },
      {
        id: 2,
        link: "https://docs.google.com/forms/d/e/1FAIpQLSdBmEkvqK1BQT8c6FrPyLkAjloimsjfH2EHxG_bRFVFF_iGkQ/viewform",
        text: t("form.data")
      }
    ];

    // footer logos
    const partnerLogos = [
      {
        id: 1,
        img: "antofagasta",
        alt: "Antiofagasta Minerals",
        link: "http://www.aminerals.cl"
      },
      {
        id: 2,
        img: "explora",
        alt: "Explora Labs",
        link: "http://www.exploralab.cl"
      },
      {
        id: 3,
        img: "corfo",
        alt: "Corporación de Fomento de la Producción de Chile",
        link: "www.corfo.cl"
      },
      {
        id: 4,
        img: "gobierno",
        alt: "Gobierno de Chile: Ministerio de Economía, Fomento y Turismo; DIRECON Ministerio de Relaciones Exteriores",
        link: "http://www.economia.gob.cl"
      },
      {
        id: 5,
        img: "asech",
        alt: "Asociación de Emprendedores de Chile",
        link: "https://www.asech.cl/"
      }
    ];
    const devLogos = [
      {
        id: 1,
        alt: "Datawheel",
        img: "datawheel",
        link: "http://datawheel.us"
      }
    ];

    // loop through footer link arrays and create corresponding list items
    const footerNavItems = footerNavLinks.map(footerNav => (
      <li className="footer-nav-item" key={footerNav.id}>
        {!footerNav.soon ? (
          <Link
            className={`footer-nav-link${
              isHome === true && footerNav.id === 1 ? " is-home" : ""
            }`}
            activeClassName="is-active"
            to={footerNav.link}
          >
            {footerNav.text}
          </Link>
        ) : (
          <div className="footer-nav-link is-disabled">
            {footerNav.text}
            <ComingSoon />
          </div>
        )}
      </li>
    ));

    const feedbackLinkItems = feedbackLinks.map(feedbackLink => (
      <li className="footer-feedback-item" key={feedbackLink.id}>
        <a
          className="footer-feedback-link"
          href={feedbackLink.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {feedbackLink.text}
        </a>
      </li>
    ));

    // loop through footer logo arrays and create corresponding list items
    const partnerLogoItems = partnerLogos.map(partnerLogo => (
      <li className="footer-logo-item" key={partnerLogo.id}>
        <a className="footer-logo-link" href={partnerLogo.link}>
          <span className="u-visually-hidden">{partnerLogo.alt}</span>
          <img
            className="footer-logo-img"
            src={`/images/logos/footer/${partnerLogo.img}-logo-white.svg`}
            alt={partnerLogo.alt}
          />
        </a>
      </li>
    ));
    const devLogoItems = devLogos.map(devLogo => (
      <li className="footer-logo-item" key={devLogo.id}>
        <a className="footer-logo-link" href={devLogo.link}>
          <span className="u-visually-hidden">{devLogo.alt}</span>
          <img
            className="footer-logo-img"
            src={`/images/logos/footer/${devLogo.img}-logo-white.svg`}
            alt={devLogo.alt}
          />
        </a>
      </li>
    ));

    return (
      <footer className="footer">

        {/* main footer content */}
        <div className="footer-main-container">
          {/* main nav */}
          <nav className="footer-nav">
            <h2 className="footer-nav-heading font-md">{t("Navigation")}</h2>
            <ul className="footer-nav-list font-sm u-list-reset">
              { footerNavItems }
            </ul>
          </nav>

          {/* logos */}
          <div className="footer-logo-container">
            {/* partners */}
            <div className="footer-partner-logo-container">
              <h2 className="footer-logo-heading font-md">{t("Supported by")}</h2>
              <ul className="footer-logo-list u-list-reset">
                { partnerLogoItems }
              </ul>
            </div>
            {/* datawheel */}
            <div className="footer-dev-logo-container">
              <h2 className="footer-logo-heading font-md">{t("Built by")}</h2>
              <ul className="footer-logo-list u-list-reset">
                { devLogoItems }
              </ul>
            </div>
          </div>
        </div>

        {/* feedback */}
        <div className="footer-feedback-container">
          <ul className="footer-feedback-list u-list-reset font-xs">
            { feedbackLinkItems }
          </ul>
        </div>
      </footer>
    );
  }
}

export default translate()(Footer);
