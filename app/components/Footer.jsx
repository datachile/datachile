import React from "react";
import {connect} from "react-redux";
import "./Footer.css";


export default function Footer() {
  return (
    <footer>
        <p className="collaboration">Created in collaboration</p>
        <img className="logo-datawheel" src="/images/logos/logo-datawheel.png" />
        <img className="logo" src="/images/logos/logo-asech.svg" />
        <img className="logo" src="/images/logos/logo-antofagasta-minerals.svg" />
        <img className="logo" src="/images/logos/logo-corfo.svg" />
        <img className="logo" src="/images/logos/logo-gob.png" />
    </footer>
  );
}
