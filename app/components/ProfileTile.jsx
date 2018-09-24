import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
// import Shiitake from "shiitake";

import "./ProfileTile.css";

class ProfileTile extends Component {
  render() {
    const { t, item, className } = this.props;

    const theme =
      ["national", "region", "comuna"].indexOf(item.type) > -1
        ? "geo"
        : item.type;

    const i18nType = {
      national: t("National"),
      region: t("Region"),
      comuna: t("Comuna"),
      countries: t("Country"),
      industries: t("Industry"),
      products: t("Product")
    };

    const type = i18nType[item.type] ? i18nType[item.type] : item.type;

    return (
      <Link
        key={item.name + "anchor"}
        className={`tile ${className} border-${theme}-hover`}
        to={item.url}
        title={item.name}
      >
        <span className="tile-inner">
          {/* profile title */}
          <span className="tile-title subhead font-xs">
            {item.name}
          </span>

          {/* category indicator */}
          {theme && (
            <span className={`category color-${theme} font-xxs`}>
              {type && (
                <img
                  className="category-icon"
                  src={`/images/icons/icon-${theme}.svg`}
                />
              )}
              <span className="u-visually-hidden">, </span>
              {type}
              <span className="u-visually-hidden">.</span>
            </span>
          )}
        </span>

        {/* background image */}
        <img className="tile-img" src={item.img} alt="" />
      </Link>
    );
  }
}

export default translate()(ProfileTile);
