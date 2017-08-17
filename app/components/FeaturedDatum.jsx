import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { FORMATTERS } from "helpers/formatters";
import SvgImage from "components/SvgImage";

import "./FeaturedDatum.css";

class FeaturedDatum extends Component {
    render() {
        const { t, icon, datum, title, subtitle, className } = this.props;

        return (
            <div className={"featured-datum " + className}>
                <div className="featured-datum-icon">
                    <SvgImage src={`/images/slider-icon/icon-${icon}.svg`} />
                </div>
                <div className="featured-datum-text">
                    <p className="featured-datum-data">
                        {datum}
                    </p>
                    <h4 className="featured-datum-title">
                        {title}
                    </h4>
                    <p className="featured-datum-subtitle">
                        {subtitle}
                    </p>
                </div>
            </div>
        );
    }
}

export default translate()(connect(state => ({}), {})(FeaturedDatum));
