import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { FORMATTERS } from "helpers/formatters";
import SvgImage from "components/SvgImage";

import "./FeaturedDatumSplash.css";

class FeaturedDatumSplash extends Component {
    render() {
        const { t, icon, datum, decile, title, source, className, rank } = this.props;

        let full, half, none;

        if (decile !== null && decile !== undefined)  {
            full = Math.floor(decile / 2);
            half = decile % 2 != 0 ? 1 : 0;
            none = 5 - half - full;
        }

        const iconUrl = `/images/splash-icon/icon-${icon}.svg`;

        return (
            <div className={"featured-datum-splash " + className}>
                <h4 className="featured-datum-splash-title">
                    {title} {rank && <small>{rank}</small> }
                </h4>
                {decile !== null && decile !== undefined && <div className="featured-datum-splash-icons">
                    {[...Array(full)].map((x, i) =>
                        <SvgImage
                            extraClass="full"
                            src={`/images/splash-icon/icon-${icon}-full.svg`}
                        />
                     )}
                    {half == 1 &&
                     <SvgImage
                         extraClass="half"
                         src={`/images/splash-icon/icon-${icon}-half.svg`}
                     />}
                    {[...Array(none)].map((x, i) =>
                        <SvgImage
                            extraClass="none"
                            src={`/images/splash-icon/icon-${icon}-none.svg`}
                        />
                     )}
                </div>}
                <div className="featured-datum-splash-data">
                    <p className="featured-datum-data">
                        {datum}
                    </p>
                </div>
                <h6 className="featured-datum-splash-source">
                    {source}
                </h6>
            </div>
        );
    }
}

export default translate()(connect(state => ({}), {})(FeaturedDatumSplash));
