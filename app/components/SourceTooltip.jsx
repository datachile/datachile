import React, { Component } from "react";
// import { Link } from "react-router";
import { withNamespaces } from "react-i18next";
//import { Tooltip2 } from "@blueprintjs/labs";
import { sources, getI18nSourceObject } from "helpers/consts";

import { Tooltip } from "@blueprintjs/core";

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
      <div
        className={`source-tooltip ${sourceData ? "for-splash" : "for-viz"}`}
      >
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
            <span className="bp3-icon bp3-icon-chevron-right" />
          </p>
        )}
      </div>
    );

    return (
      <Tooltip
        className={`source-tooltip-trigger ${
          sourceData ? "for-splash" : "for-viz"
        }`}
        content={sourceTooltipContent}
        placement={sourceData ? "bottom" : "top"}
        useSmartArrowPositioning={false}
        useSmartPositioning={true}
      >
        {cubeSource ? (
          <a href={cubeSource.url}>
            <span className="bp3-icon bp3-icon-info-sign" />
          </a>
        ) : (
          <span className="bp3-icon bp3-icon-info-sign" />
        )}
      </Tooltip>
    );
  }
}

// SourceTooltip.defaultProps = {
//   key: "value"
// };

export default withNamespaces()(SourceTooltip);
