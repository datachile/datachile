import React, {Component} from "react";
import {connect} from "react-redux";
import {toggleSearch} from "actions/index";
import {translate} from "react-i18next";
import {Link, browserHistory} from "react-router";
import "./Search.css";

import { GEOARRAY } from "helpers/GeoData";

import {strip} from "d3plus-text";
import {dataFold} from "d3plus-viz";

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      results: []
    };
  }

  onChange(e) {

    const userQuery = e.target.value;
    const {limit}  = this.props;

    if (userQuery.length === 0) this.setState({active: true, results: []});
    // else if (userQuery.length < 3) return;
    else {
      let results = GEOARRAY.filter(e => {
        return e.name.toLowerCase().indexOf(userQuery.toLowerCase())>-1 || e.clean.toLowerCase().indexOf(userQuery.toLowerCase())>-1;
      })
      .sort((a,b) => {return a.name.toLowerCase()>b.name.toLowerCase()});

      if (limit) results = results.slice(0, limit);
      this.setState({active: true, results});
    }

  }

  componentDidMount() {

    document.addEventListener("keydown", () => {

      const {local, searchActive, toggleSearch} = this.props;
      const {active} = this.state;
      const key = event.keyCode;
      const DOWN = 40,
            ENTER = 13,
            ESC = 27,
            S = 83,
            UP = 38;

      const enabled = local ? active : searchActive;
      const toggle = local ? () => this.setState({active: !active}) : toggleSearch;

      if (!local && !enabled && key === S && event.target.tagName.toLowerCase() !== "input") {
        event.preventDefault();
        toggle();
      }
      else if (enabled && key === ESC && event.target === this.refs.input) {
        event.preventDefault();
        toggle();
      }
      else if (enabled && event.target === this.refs.input) {

        const highlighted = document.querySelector(".highlighted");

        if (key === ENTER && highlighted) {
          //this.refs.input.value = highlighted.querySelector("a").innerHTML;
          toggle();
          setTimeout(() => {
            browserHistory.push(highlighted.querySelector("a").href);
            //window.location = highlighted.querySelector("a").href;
          }, 500);
        }
        else if (key === DOWN || key === UP) {

          if (!highlighted) {
            if (key === DOWN) document.querySelector(".results > li:first-child").classList.add("highlighted");
          }
          else {

            const results = document.querySelectorAll(".results > li");

            const currentIndex = [].indexOf.call(results, highlighted);

            if (key === DOWN && currentIndex < results.length - 1) {
              results[currentIndex + 1].classList.add("highlighted");
              highlighted.classList.remove("highlighted");
            }
            else if (key === UP) {
              if (currentIndex > 0) results[currentIndex - 1].classList.add("highlighted");
              highlighted.classList.remove("highlighted");
            }
          }
        }

      }

    }, false);

  }

  render() {

    const {className, searchActive, local, t} = this.props;
    const {active, results} = this.state;
    const enabled = local ? active : searchActive;

    if (this.refs.input) {
      if (enabled) this.refs.input.focus();
      else this.refs.input.blur();
    }

    return (
      <div className={ `${className} ${ enabled ? "active" : "" } search-component` }>
        <div className="input">
          <input type="text" ref="input" onChange={ this.onChange.bind(this) } placeholder={ t("Enter a location") } />
        </div>
        <ul className="results">
          { results.map(result =>
            <li key={ result.key } className="result">
              <Link to={ result.url }>{ result.name }   |   { result.type }</Link>
            </li>
          )}
        </ul>
      </div>
    );

  }
}

Search.defaultProps = {
  className: "search-nav"
};


export default translate()(connect(state => ({
  searchActive: state.search.searchActive
}), {toggleSearch})(Search));
