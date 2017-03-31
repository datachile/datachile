import React, {Component} from "react";
import {connect} from "react-redux";
import {activateSearch} from "actions/users";
import Nav from "components/Nav";
import Footer from "components/Footer";
import Search from "components/Search";

import "normalize.css/normalize.css";

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {children, searchActive} = this.props;
    return (
        <div className="container">
          { searchActive ? <Search /> : null }
          <Nav />
          { children }
          <Footer />
        </div>
    );
  }

  componentDidMount() {

    document.addEventListener("keydown", () => {

      // 's' key
      if (event.keyCode === 83) {
        if (event.target.tagName !== "INPUT") {
          event.preventDefault();
          this.props.activateSearch();
        }
      }
      // 'esc' key
      else if (event.keyCode === 27) {
        event.preventDefault();
        this.props.activateSearch();
      }
    }, false);

  }
}

export default connect(state => ({
  searchActive: state.search.searchActive
}), {activateSearch})(App);
