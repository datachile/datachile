import React from "react";
import { shortenProfileName } from "helpers/formatters";

import "./FeaturedDatum.css";

function FeaturedDatum(props) {
  const { icon, datum, title, subtitle, className } = props;

  if (props.showIf !== true) return null;

  // truncate & add ellipses if necessary
  let datumTruncated = null;
  if (datum) {
    datumTruncated = shortenProfileName(datum);
  }

  return (
    <div className={"featured-datum " + className}>
      <div className="featured-datum-icon">
        <img src={`/images/slider-icon/icon-${icon}.svg`} />
      </div>
      <div className="featured-datum-text">
        <h4 className="featured-datum-title font-xxs">
          <span className="featured-datum-data heading font-md">
            {datumTruncated ? datumTruncated : datum}
          </span>
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
