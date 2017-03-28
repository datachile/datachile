import React, {Component} from "react";
import {connect} from "react-redux";
import {activateSearch} from "actions/users";
import "./Search.css";

import {API} from ".env";
import axios from "axios";

import {strip} from "d3plus-text";
import {dataFold} from "d3plus-viz";

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }

  onChange(e) {

    const userQuery = e.target.value;

    if (userQuery.length === 0) this.setState({results: []});
    // else if (userQuery.length < 3) return;
    else {
      axios.get(`${API}attrs/search/?q=${strip(userQuery)}`)
        .then(res => this.setState({results: dataFold(res.data)}));
    }

  }

  handleKeyDown(e) {

    const DOWN_ARROW = 40;
    const UP_ARROW = 38;
    const ENTER = 13;

    const highlighted = document.querySelector(".highlighted");

    if (e.keyCode === ENTER && highlighted) {
      window.location = highlighted.querySelector("a").href;
    }
    else if (e.keyCode === DOWN_ARROW || e.keyCode === UP_ARROW) {

      if (!highlighted) {
        if (e.keyCode === DOWN_ARROW) document.querySelector(".results > li:first-child").classList.add("highlighted");
      }
      else {

        const results = document.querySelectorAll(".results > li");

        const currentIndex = [].indexOf.call(results, highlighted);

        if (e.keyCode === DOWN_ARROW && currentIndex < results.length - 1) {
          results[currentIndex + 1].classList.add("highlighted");
          highlighted.classList.remove("highlighted");
        }
        else if (e.keyCode === UP_ARROW) {
          if (currentIndex > 0) results[currentIndex - 1].classList.add("highlighted");
          highlighted.classList.remove("highlighted");
        }
      }
    }
  }

  componentDidMount() {
    this.refs.input.focus();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {

    const {results} = this.state;

    return (
      <div className="search">
        <div className="input">
          <img className="icon" src="/images/nav/search.svg" />
          <input type="text" ref="input" onChange={ this.onChange.bind(this) } placeholder="Enter a location" />
        </div>
        <ul className="results">
          { results.map(result =>
            <li key={ result.id } className="result">
              <a href={ `/profile/${result.id}` }>{ result.name }</a>
            </li>
          )}
        </ul>
      </div>
    );

  }
}

export default connect(state => ({
  focus: state.focus
}), {activateSearch})(Search);
