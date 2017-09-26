import React, {Component} from "react";
import {connect} from "react-redux";
import { CanonComponent } from "datawheel-canon";
import Nav from "components/Nav";

import "./NotFound.css";

class Search extends Component {

  render() {
    return (
      <CanonComponent id="not-found" data={this.props.data} topics={[]}>
        <Nav />
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
      </CanonComponent>
    );
  }
}

export default connect(() => ({}), {})(Search);
