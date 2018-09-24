import React from "react";
import Shiitake from "shiitake";

import "./FeaturedDatum.css";

function FeaturedDatum(props) {
  const { icon, datum, title, subtitle, className } = props;

  if (props.showIf !== true) return null;

  return (
    <div className={"featured-datum " + className}>
      <div className="featured-datum-icon">
        <img src={`/images/slider-icon/icon-${icon}.svg`} />
      </div>
      <div className="featured-datum-text">
        <h4 className="featured-datum-title font-xxs">
          <span className="featured-datum-data heading font-md">{datum}</span>
          <span className="label">{title}</span>
        </h4>
        <p className="featured-datum-subtitle font-xxs">{subtitle}</p>
      </div>
    </div>
  );
}

FeaturedDatum.defaultProps = {
  showIf: true
};

export default FeaturedDatum;
