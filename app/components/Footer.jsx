import React from "react";
import {connect} from "react-redux";
import "./Footer.css";


export default function Footer() {
  return (
    <footer>
      <img className="ifpri" src="/images/logos/ifpri.png" />
      <img className="datawheel" src="/images/logos/datawheel.png" />
    </footer>
  );
}
