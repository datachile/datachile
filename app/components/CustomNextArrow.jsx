import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";

class CustomNextArrow extends Component {
    render() {
        const { t } = this.props;

        return (
            <a {...this.props}><span className="pt-icon-standard pt-icon-chevron-right" /></a>
        );
    }
}

export default translate()(CustomNextArrow);
