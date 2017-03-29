import React, {Component} from "react";
import {connect} from "react-redux";

import "./NotFound.css";

class Search extends Component {

  render() {
    return (
      <div className="about">
        <div className="intro">
          <div className="splash">
            <div className="image"></div>
            <div className="gradient"></div>
          </div>
          <div className="header">
            <div className="meta">
                <div className="title">Oops!</div>
            </div>
          </div>
        </div>
       <h2>404 NOT FOUND</h2>
      </div>
    );
  }
}

export default connect(() => ({}), {})(Search);
