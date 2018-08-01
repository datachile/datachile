import React, { Component } from "react";
import { translate } from "react-i18next";

import { sources, getI18nSourceObject } from "helpers/consts";

import "./FeaturedDatumSplash.css";

class FeaturedDatumSplash extends Component {
  render() {
    const {
      t,
      icon,
      datum,
      decile,
      title,
      subtitle,
      source,
      className,
      rank,
      level,
      name
    } = this.props;

    let full, half, none, rounded;

    if (decile !== null && decile !== undefined && !isNaN(decile)) {
      full = Math.floor(decile / 2);
      half = decile % 2 != 0 ? 1 : 0;
      none = 5 - half - full;
      rounded = Math.round(decile * 100) / 100;
    }

    // const sourceData = sources[source];
    const src = t("about.data", { returnObjects: true });
    const sourceData = getI18nSourceObject(src, source);

    return (
      <div className={"featured-datum-splash " + className}>

        {/* value */}
        <h3 className="featured-datum-value font-xl">
          <span className="u-visually-hidden">{title} </span>
          {datum ? datum : t("no_datum")}
        </h3>

        {/* title */}
        <p className="featured-datum-label label font-xs" aria-hidden="true">
          {title}
        </p>

        {/* subtitle */}
        {subtitle && (
          <p className="featured-datum-subtitle font-lg heading">{subtitle}</p>
        )}

        {/* decile icons */}
        {decile !== null &&
          decile !== undefined &&
          !isNaN(decile) && (
            <div className="featured-datum-decile">

              <div className="featured-datum-icons">
                {[...Array(full)].map((x, i) => (
                  <img
                    className="featured-datum-img full"
                    src={`/images/splash-icon/icon-${icon}-full.svg`}
                  />
                ))}
                {half == 1 && (
                  <img
                    className="featured-datum-img half"
                    src={`/images/splash-icon/icon-${icon}-half.svg`}
                  />
                )}
                {[...Array(none)].map((x, i) => (
                  <img
                    className="featured-datum-img none"
                    src={`/images/splash-icon/icon-${icon}-none.svg`}
                  />
                ))}
              </div>
            </div>
        )}

        {/* rank, decile, and/or level tags */}
        <div className="featured-datum-tags">
          {rank &&
            <p className="featured-datum-rank tag background-geo font-xxs">{rank}</p>
          }

          { decile &&
            <p className="featured-datum-decile tag background-geo font-xxs">
              {rounded} {t("decile")}
            </p>
          }

          {level && (
            <p className="featured-datum-splash-level tag font-xxs">
              {t(`${level}.warning`, name)}
            </p>
          )}
        </div>

        {/* source */}
        {sourceData && (
          <p className="featured-datum-source font-xxs">
            <span className="featured-datum-source-label">{t("source")}: </span>
            <span className="featured-datum-source-title">
              {sourceData.title}, {sourceData.year}
            </span>
          </p>
        )}
      </div>
    );
  }
}

export default translate()(FeaturedDatumSplash);
