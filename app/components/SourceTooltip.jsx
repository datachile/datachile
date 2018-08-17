import React, { Component } from "react";
// import { Link } from "react-router";
import { translate } from "react-i18next";
import { Tooltip2 } from "@blueprintjs/labs";

import "./SourceTooltip.css";

class SourceTooltip extends Component {
  constructor() {
    super();
    // this.state = { };
  }

  render() {
    const { sourceData, t } = this.props;
    // const { } = this.state;

    // source tooltip
    const sourceTooltipContent = sourceData && (
      <div className="source-tooltip">
        <h4 className="source-tooltip-heading font-xs">{t("source")}:</h4>
        <p className="source-tooltip-name font-xxs">
          {sourceData.title}, {sourceData.year}
        </p>
      </div>
    );

    return (
      <Tooltip2
        className="source-tooltip-trigger"
        content={sourceTooltipContent}
        placement="bottom"
      >
        <span className="pt-icon pt-icon-info-sign">
          <span className="u-visually-hidden">{t("Data source")}</span>
        </span>
      </Tooltip2>
    );
  }
}

// SourceTooltip.defaultProps = {
//   key: "value"
// };

export default translate()(SourceTooltip);
