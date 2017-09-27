import React, { Component } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";

import { GEO } from "helpers/dictionary";
import { GEOMAP } from "helpers/GeoData";
import FeaturedBox from "components/FeaturedBox";
import SourceNote from "components/SourceNote";
import Nav from "components/Nav";
import Search from "components/Search";
import { translate } from "react-i18next";

import "./Home.css";

class Home extends Component {
  static need = [];

  render() {
    const { focus, message, t } = this.props;

    const featured = focus.map(f => GEOMAP.getRegion(f));

    return (
      <CanonComponent id="home" data={this.props.data} topics={[]}>
        <div className="home">
          <Nav />
          <div className="splash">
            <div className="image" />
            <div className="gradient" />
          </div>
          <div className="intro">
            <div className="text">
              <h2 className="title">
                <span>Data Chile</span>
              </h2>
              <p className="lead">
                {t(
                  "Interactive data visualization platform about Chilean public data"
                )}
              </p>
            </div>
            <div className="search-home-wrapper">
              <Search className="search-home" local={true} limit={5} />
            </div>
          </div>
          <div className="dc-container">
            <h3 className="title-tiles">
              {t("Explore featured profiles")}
            </h3>
          </div>
          <div className="tiles">
            <div className="dc-container">
              <div className="tiles-container" />
              <div className="source-container">
                <SourceNote icon="/images/icons/icon-camera-source.svg">
                  <strong>{t("Pic by")}:</strong> Example Author
                </SourceNote>
              </div>
            </div>
          </div>
        </div>
      </CanonComponent>
    );
  }
}

export default translate()(
  connect(
    state => ({
      focus: state.focus
    }),
    {}
  )(Home)
);
