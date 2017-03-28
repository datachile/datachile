import React, {Component} from "react";
import {connect} from "react-redux";
import { GEO } from "helpers/dictionary";
import { GEOMAP } from "helpers/dictionary";
import FeaturedBox from "components/FeaturedBox";

import "./Home.css";

class Home extends Component {

  render() {

    const {attrs, focus, message} = this.props;

    const featured = focus.map(f => GEOMAP.getRegion(f));

    return (
      <div className="home">
        <div className="splash">
          <div className="image"></div>
          <div className="gradient"></div>
        </div>
        <div className="intro">
          <div className="text">
            <h2 className="title">
              <img src="/images/logos/logo-datachile-single.svg" />
            <span>Data<strong>Chile</strong></span>
            </h2>
      <p className="lead">Interactive data visualization platform about Chilean public data</p>
          </div>
        </div>
        <div className="tiles">
          <h3 className="title">Featured profiles</h3>
          
          {
            featured.map(f =>
                <FeaturedBox id={f.key} item={f} />
            )
          }

          <div className="spacer"></div>
          <div className="spacer"></div>
          <div className="spacer"></div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
    attrs: state.attrs.geo,
    focus: state.focus
}), {})(Home);
