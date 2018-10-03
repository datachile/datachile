import React, { Component } from "react";
import { translate } from "react-i18next";
import { sources, getI18nSourceObject } from "helpers/consts";

import SourceTooltip from "components/SourceTooltip";
import LevelWarning from "components/LevelWarning";

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
      name,
      path
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

    // grab parent URL / get parent path
    const parentPath = path ? path.substring(0, path.lastIndexOf("/")) : null;
    // console.log(parentPath);

    return (
      <div className={"featured-datum-splash " + className}>

        {/* decile icons */}
        {decile !== null &&
          decile !== undefined &&
          !isNaN(decile) && (
            <div className="featured-datum-decile">

              <div className="featured-datum-icon">
                <div className="featured-datum-img-container">
                  {/* make sure filled icon is displayed by default */}
                  <img
                    className="featured-datum-img dummy-featured-datum-img full"
                    src={`/images/splash-icon/icon-${icon}-full.svg`}
                  />
                  {/* create functional decile icons */}
                  {[...Array(full)].map((x, i) => (
                    <img key={i}
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
                    <img key={i}
                      className="featured-datum-img none"
                      src={`/images/splash-icon/icon-${icon}-empty.svg`}
                    />
                  ))}
                </div>
              </div>
            </div>
        )}

        {/* rank, and/or decile tags */}
        {(rank || decile) && (
          <div className="featured-datum-tags">
            {rank && (
              <p className="featured-datum-rank tag background-geo font-xxs">
                {rank}
              </p>
            )}
            {decile && (
              <p className="featured-datum-decile tag background-geo font-xxs">
                {rounded} {t("decile")}
              </p>
            )}
          </div>
        )}

        {/* title */}
        <p className="featured-datum-label label font-xs" aria-hidden="true">
          {title}
        </p>

        {/* value */}
        <h3 className="featured-datum-value font-xl">
          <span className="u-visually-hidden">{title} </span>
          {datum ? datum : t("no_datum")}
          <SourceTooltip sourceData={sourceData} />
        </h3>

        {/* subtitle */}
        {subtitle && (
          <p className="featured-datum-subtitle font-sm label">{subtitle}</p>
        )}

        {/* this data is in another castle */}
        {level && (
          <LevelWarning name={name.caption} path={path} />
        )}
      </div>
    );
  }
}

export default translate()(FeaturedDatumSplash);
