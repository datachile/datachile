import React, { Component } from "react";
import { connect } from "react-redux";
import Footer from "components/Footer";

import mondrianClient from "helpers/MondrianClient";

import "./App.css";

class App extends Component {
  static preneed = [
    (params, store) => {
      let prm;
      const r = { key: "__cubes__" };
      if (typeof window === "undefined") {
        prm = Promise.resolve({ ...r, data: false });
      } else if (store.data.__cubes__) {
        prm = Promise.resolve({ ...r, data: true });
      } else {
        // force population of the internal MondrianClient cache.
        prm = mondrianClient.cubes().then(() => ({ ...r, data: true }));
      }

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { children } = this.props;
    return (
      <div className="main-container">
        {children}
        <Footer />
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener(
      "keydown",
      () => {
        // 's' key
        if (event.keyCode === 83) {
          if (event.target.tagName !== "INPUT") {
            event.preventDefault();
            this.props.activateSearch();
          }
        } else if (event.keyCode === 27) {
          // 'esc' key
          event.preventDefault();
          this.props.activateSearch();
        }
      },
      false
    );
  }
}

export default connect(
  state => ({
    data: state.data
  }),
  {}
)(App);
