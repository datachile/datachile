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
        <Shiitake
          lines={3}
          tagName="p"
          className="featured-datum-data"
          renderFullOnServer={true}
        >
          {datum}
        </Shiitake>
        <h4 className="featured-datum-title">{title}</h4>
        <p className="featured-datum-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

FeaturedDatum.defaultProps = {
  showIf: true
};

export default FeaturedDatum;
