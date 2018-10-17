import React, { Component } from "react";
// import { Link } from "react-router";
import { translate } from "react-i18next";
import { Tooltip2 } from "@blueprintjs/labs";
import SourceNote from "components/SourceNote";

import "./InfancyTooltip.css";

class InfancyTooltip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    // default context
    const context = this.props.context || "infancy";

    // source tooltip
    const InfancyTooltipContent = (
      <div className="source-tooltip infancy-tooltip">
        <p className="infancy-tooltip-body font-xs">
          {t(`infancy.about_${context}`)}
        </p>
      </div>
    );

    return (
      <Tooltip2
        className="infancy-tooltip-trigger source-tooltip-trigger"
        content={InfancyTooltipContent}
        placement="auto"
        useSmartArrowPositioning={false}
        useSmartPositioning={true}
      >
        <span className="pt-icon pt-icon-info-sign" />
      </Tooltip2>
    );
  }
}

// InfancyTooltip.defaultProps = {
//   key: "value"
// };

export default translate()(InfancyTooltip);
