import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { FORMATTERS } from "helpers/formatters";

import "./InfoLogoItem.css";

class InfoLogoItem extends Component {
    render() {
        const { item } = this.props;

        return (
            <div key={item.logo + "-anchor"} className="info-logo-item">
                <img
                    className="logo"
                    src={`/images/info-logo/${item.logo}.png`}
                />
                {item.value && <span className="value">{item.value}</span>}
                {item.verb && <p className="verb">{item.verb}</p>}
                {item.title && <p className="title">{item.title}</p>}
            </div>
        );
    }
}

export default translate()(connect(state => ({}), {})(InfoLogoItem));
