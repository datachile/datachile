import React, {Component} from "react";
import {connect} from "react-redux";
import { GEO } from "helpers/dictionary";
import { GEOMAP } from "helpers/dictionary";
import FeaturedBox from "components/FeaturedBox";
import Search from "components/Search";

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
        <div className="intro dc-container">
          <div className="text">
            <h2 className="title">
              <span>Data Chile</span>
            </h2>
            <p className="lead">Interactive data visualization platform about Chilean public data</p>
          </div>
          <div className="search-home-wrapper">
            <Search className="search-home" local={ true } limit={ 5 } />
          </div>
        </div>
        <h3 className="title-tiles dc-container">Explore reatured profiles</h3>
        <div className="tiles">
          <div className="dc-container">
            
            {
              featured.map(f =>
                  <FeaturedBox key={f.key} item={f} />
              )
            }
          </div>

        </div>
      </div>
    );
  }
}

export default connect(state => ({
    attrs: state.attrs.geo,
    focus: state.focus
}), {})(Home);
