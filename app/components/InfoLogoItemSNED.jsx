import React, { Component } from "react";
import { translate } from "react-i18next";

import "./InfoLogoItemSNED.css";

class InfoLogoItemSNED extends Component {
  render() {
    const { item } = this.props;

    return (
      <div key={item.logo + "-anchor"} className="info-logo-item">
        <img className="logo" src={`/images/info-logo/${item.logo}.png`} />
        <div className="datum">
          {item.value && <span className="value">{item.value}</span>}
          {item.verb && <span className="verb">{item.verb}</span>}
        </div>
        {item.description && <p className="description">{item.description}</p>}
        {item.title && <p className="title">{item.title}</p>}
      </div>
    );
  }
}

export default translate()(InfoLogoItemSNED);
