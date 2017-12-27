import React from "react";
import SvgImage from "components/SvgImage";
import Shiitake from "shiitake";

import "./FeaturedDatum.css";

function FeaturedDatum(props) {
  const { icon, datum, title, subtitle, className } = props;

  return (
    <div className={"featured-datum " + className}>
      <div className="featured-datum-icon">
        <SvgImage src={`/images/slider-icon/icon-${icon}.svg`} />
      </div>
      <div className="featured-datum-text">
        <Shiitake lines={3} tagName="p" className="featured-datum-data">
          {datum}
        </Shiitake>
        <h4 className="featured-datum-title">{title}</h4>
        <p className="featured-datum-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

export default FeaturedDatum;
