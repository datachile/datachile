import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import "./Footer.css";


export default function Footer() {
  return (
    <footer>
        <div className="dc-container footer-container">
            <div className="logos">
                <p className="collaboration">Created in collaboration</p>
                <img className="logo-datawheel" src="/images/logos/logo-datawheel.png" />
                <img className="logo" src="/images/logos/logo-asech.svg" />
                <img className="logo" src="/images/logos/logo-antofagasta-minerals.svg" />
                <img className="logo" src="/images/logos/logo-corfo.svg" />
                <img className="logo" src="/images/logos/logo-gob.png" />
            </div>

            <div className="nav-links">
                <Link className="link" to="/">Home</Link>
                <span className="link link-dot">&#183;</span>
                <Link className="link" to="/explore">Explore</Link>
                <span className="link link-dot">&#183;</span>
                <Link className="link" to="/profile">Profile</Link>
                <span className="link link-dot">&#183;</span>
                <Link className="link" to="/topics">Topics</Link>
                <span className="link link-dot">&#183;</span>
                <Link className="link" to="/about">About</Link>
                <span className="link link-dot">&#183;</span>
                <Link className="link" to="/contact">Contact</Link>
                <span className="link link-dot">&#183;</span>
            </div>
        </div>
    </footer>
  );
}
