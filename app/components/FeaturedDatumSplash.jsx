import React, { Component } from "react";
import { translate } from "react-i18next";

import "./FeaturedDatumSplash.css";

class FeaturedDatumSplash extends Component {
  render() {
    const {
      t,
      icon,
      datum,
      decile,
      title,
      source,
      className,
      rank
    } = this.props;

    let full, half, none;

    if (decile !== null && decile !== undefined) {
      full = Math.floor(decile / 2);
      half = decile % 2 != 0 ? 1 : 0;
      none = 5 - half - full;
    }

    const iconUrl = `/images/splash-icon/icon-${icon}.svg`;

    return (
      <div className={"featured-datum-splash " + className}>
        <h4 className="featured-datum-splash-title">
          {title} {rank && <small>{rank}</small>}
        </h4>
        {decile !== null &&
          decile !== undefined && (
            <div className="featured-datum-splash-icons">
              {[...Array(full)].map((x, i) => (
                <img
                  className="icon-img full"
                  src={`/images/splash-icon/icon-${icon}-full.svg`}
                />
              ))}
              {half == 1 && (
                <img
                  className="icon-img half"
                  src={`/images/splash-icon/icon-${icon}-half.svg`}
                />
              )}
              {[...Array(none)].map((x, i) => (
                <img
                  className="icon-img none"
                  src={`/images/splash-icon/icon-${icon}-none.svg`}
                />
              ))}
            </div>
          )}
        <div className="featured-datum-splash-data">
          <p className="featured-datum-data">{datum}</p>
        </div>
        <h6 className="featured-datum-splash-source">{source}</h6>
      </div>
    );
  }
}

export default translate()(FeaturedDatumSplash);
