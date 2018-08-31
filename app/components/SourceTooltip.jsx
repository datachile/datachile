import React, { Component } from "react";
// import { Link } from "react-router";
import { translate } from "react-i18next";
import { Tooltip2 } from "@blueprintjs/labs";
import { sources, getI18nSourceObject } from "helpers/consts";

import "./SourceTooltip.css";

/*
 * @param {object} props
 * @param {string} props.cube
 * @param {string|number} props.year
 */

class SourceTooltip extends Component {
  constructor() {
    super();
  }

  render() {
    const { cube, sourceData, t } = this.props;
    const src = t("about.data", { returnObjects: true });

    // check if we're passing a cube query as a prop
    let cubeSource = null;
    if (cube) {
      cubeSource = getI18nSourceObject(src, cube);
      // console.log(cubeSource);
    }

    // source tooltip
    const sourceTooltipContent = (
      <div className={`source-tooltip ${ sourceData ? "for-splash" : "for-viz" }`}>
        <h4 className="source-tooltip-heading font-xs">{t("source")}:</h4>

        {/* splash stats */}
        {sourceData && (
          <p className="source-tooltip-name font-xxs">
            {sourceData.title}
            {sourceData.year && `, ${sourceData.year}`}
          </p>
        )}

        {/* viz section */}
        {cubeSource && (
          <p className="link font-xxs">
            {cubeSource.title}
            {cubeSource.source && `, ${cubeSource.source}`}
            {cubeSource.year && `, ${cubeSource.year}`}
            <span className="pt-icon pt-icon-chevron-right" />
          </p>
        )}
      </div>
    );

    return (
      <Tooltip2
        className={`source-tooltip-trigger ${ sourceData ? "for-splash" : "for-viz" }`}
        content={sourceTooltipContent}
        placement={sourceData ? "bottom" : "top"}
      >
        {cubeSource ? (
          <a href={cubeSource.url}>
            <span className="pt-icon pt-icon-info-sign">
              <span className="u-visually-hidden">{t("Data source")}</span>
            </span>
          </a>
        ) : (
          <span className="pt-icon pt-icon-info-sign">
            <span className="u-visually-hidden">{t("Data source")}</span>
          </span>
        )}
      </Tooltip2>
    );
  }
}

// SourceTooltip.defaultProps = {
//   key: "value"
// };

export default translate()(SourceTooltip);
