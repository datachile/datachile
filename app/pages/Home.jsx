import React, { Component } from "react";
import { connect } from "react-redux";
import { GEO } from "helpers/dictionary";
import { GEOMAP } from "helpers/GeoData";
import FeaturedBox from "components/FeaturedBox";
import SourceNote from "components/SourceNote";
import Search from "components/Search";
import { translate } from "react-i18next";

import "./Home.css";

class Home extends Component {
  static need = [
    (params, store) => {
      /*const geoObj = getGeoObject(params);

      var prm = Promise.all(prms)
          .then((res) => {
            return { key: 'featured', data: ingestParent(res[0],res[1]) };
          });

        return {
          type: "GET_DATA",
          promise: prm
        };*/

      /*var prm;

      switch (geoObj.type) {
        case "country": {
          prm = new Promise((resolve, reject) => {
            resolve({ key: "geo", data: geoObj });
          });
          break;
        }
        case "region": {
          prm = mondrianClient
            .cube("exports")
            .then(cube => {
              return cube.dimensionsByName["Geography"].hierarchies[0].getLevel(
                "Region"
              );
            })
            .then(level => {
              return mondrianClient.member(level, geoObj.key);
            })
            .then(res => {
              return { key: "geo", data: res };
            });
          break;
        }
        case "comuna": {
          prm = mondrianClient
            .cube("exports")
            .then(cube => {
              return cube.dimensionsByName["Geography"].hierarchies[0].getLevel(
                "Comuna"
              );
            })
            .then(level => {
              return mondrianClient.member(level, geoObj.key);
            })
            .then(res => {
              return { key: "geo", data: res };
            });
          break;
        }
      }*/

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { focus, message, t } = this.props;

    const featured = focus.map(f => GEOMAP.getRegion(f));

    return (
      <div className="home">
        <div className="splash">
          <div className="image" />
          <div className="gradient" />
        </div>
        <div className="intro dc-container">
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
