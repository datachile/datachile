import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";

import "./ResultItem.css";

class ResultItem extends Component {
  render() {
    const { t, item } = this.props;

    const icon =
      ["country", "region", "comuna"].indexOf(item.type) > -1
        ? "geo"
        : item.type;

    return (
      <Link
        key={item.name + "anchor"}
        className="result-item"
        to={item.url}
        style={{
          backgroundImage: `url('${item.img}')`
        }}
      >
        <span className="col-l">
          <span className="icon-container">
            <img className="icon" src={`/images/icons/icon-${icon}.svg`} />
          </span>
        </span>
        <span className="col-r">
          <span className="name">{item.name}</span>
        </span>
      </Link>
    );
  }
}

export default translate()(ResultItem);
