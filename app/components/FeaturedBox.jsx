import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
import Shiitake from "shiitake";

import "./FeaturedBox.css";

class FeaturedBox extends Component {
  render() {
    const { t, item, className } = this.props;

    const icon =
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
        className={"tile " + className}
        to={item.url}
        title={item.name}
        style={{
          backgroundImage: `url('${item.img}')`
        }}
      >
        <span className="tile-filter" />
        <span className="col-l">
          <span className="icon-container">
            <img className="icon" src={`/images/icons/icon-${icon}.svg`} />
          </span>
          <Shiitake
            tagName="span"
            className="name"
            lines={4}
            renderFullOnServer={true}
          >
            {item.name}
          </Shiitake>
        </span>
        <span className="col-r">
          <span className="type">{type}</span>
        </span>
      </Link>
    );
  }
}

export default translate()(FeaturedBox);
