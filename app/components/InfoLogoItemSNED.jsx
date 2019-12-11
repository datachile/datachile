import React, { Component } from "react";
import { withNamespaces } from "react-i18next";

import "./InfoLogoItemSNED.css";

class InfoLogoItemSNED extends Component {
  render() {
    const { item } = this.props;

    return (
      <div key={item.logo + "-anchor"} className="info-logo-item-sned lost-1-3">
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

export default withNamespaces()(InfoLogoItemSNED);
