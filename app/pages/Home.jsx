import React, {Component} from "react";
import {connect} from "react-redux";
import { GEO } from "helpers/dictionary";
import FeaturedBox from "components/FeaturedBox";

import "./Home.css";

class Home extends Component {

  render() {

  	const {attrs, focus, message} = this.props;

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
          <FeaturedBox item={{
		    "full_name": "[Tax Geography].[Biob\u00edo]",
			"caption": "Biob\u00edo",
		    "name": "Biob\u00edo",
			"key": 8,
		    "slug": "biobio"
          }} />
          <FeaturedBox item={{
			"full_name": "[Tax Geography].[Tarapac\u00e1].[IQUIQUE]",
			"caption": "Iquique",
			"name": "Iquique",
			"key": 113,
			"slug": "iquique"
          }} />
          <FeaturedBox item={{
		    "full_name": "[Tax Geography].[Los R\u00edos]",
			"caption": "Los R\u00edos",
		    "name": "Los R\u00edos",
			"key": 14,
		    "slug": "los-rios"
          }} />
          <FeaturedBox item={{
			"full_name": "[Tax Geography].[Region Metropolitana Santiago]",
			"caption": "Region Metropolitana Santiago",
			"name": "Region Metropolitana Santiago",
			"key": 13,
			"slug": "region-metropolitana-santiago"
          }} />

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
