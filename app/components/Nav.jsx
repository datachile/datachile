import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {toggleSearch} from "actions/index";
import Search from "components/Search";
import "./Nav.css";

class Nav extends Component {

  render() {
    return (
      <nav className="nav">
        <div className="dc-container nav-container">
          <div className="nav-links">
            <Link className="logo" to="/">
              <img src="/images/logos/logo-datachile.svg"/>
            </Link>
          </div>
          <div className="nav-links">
            <Link className="link" to="/">Home</Link>
            <Link className="link" to="/explore">Explore</Link>
            <Link className="link" to="/profile">Profile</Link>
            <Link className="link" to="/topics">Topics</Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default connect(() => ({}), {toggleSearch})(Nav);
