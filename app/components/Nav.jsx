import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {activateSearch} from "actions/users";
import "./Nav.css";

class Nav extends Component {

  render() {
    return (
      <nav className="nav">
        <img className="search-btn" src="/images/nav/search.svg" onClick={ this.props.activateSearch } alt="Search" />
        <Link className="logo" to="/">
          <span className="data">Data</span>
          <span className="africa">Chile</span>
        </Link>
        <Link className="link" to="/profile">Locations</Link>
        <Link className="link" to="/">Map</Link>
        <Link className="link" to="/">About</Link>
      </nav>
    );
  }
}

export default connect(() => ({}), {activateSearch})(Nav);
