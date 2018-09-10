import React, { Component } from "react";
import { translate } from "react-i18next";

import "./InfoLogoItem.css";

class InfoLogoItem extends Component {
  render() {
    const { item } = this.props;

    return (
      <div key={item.logo + "-anchor"} className="info-logo-item">
        <img className="logo" src={`/images/info-logo/${item.logo}.png`} />
        {item.verb && (
          <p className="verb font-xxs">
            {item.verb}
            {item.title && (
              <span className="title label font-xs"> {item.title} </span>
            )}
            <span className="u-visually-hidden">
              : {item.value ? item.value : null}
            </span>
          </p>
        )}
        {item.value && (
          <span className="value heading font-lg">{item.value}</span>
        )}
      </div>
    );
  }
}

export default translate()(InfoLogoItem);
