import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {activateSearch} from "actions/users";
import "./Nav.css";

class Nav extends Component {

  render() {
    return (
      <nav className="nav">
        <Link className="logo" to="/">
          <img src="/images/logos/logo-datachile.svg"/>
        </Link>
        <Link className="link" to="/profile">Profiles</Link>
        <Link className="link" to="/">Topics</Link>
        <Link className="link" to="/">About</Link>
        <a className="link" onClick={ this.props.activateSearch }>Search</a>
      </nav>
    );
  }
}

export default connect(() => ({}), {activateSearch})(Nav);
