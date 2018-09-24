import React, { Component } from "react";
// import { Link } from "react-router";
import { translate } from "react-i18next";
import { Tooltip2 } from "@blueprintjs/labs";
import SourceNote from "components/SourceNote";

import "./SNEDTooltip.css";

class SNEDTooltip extends Component {
  constructor() {
    super();
  }

  render() {
    const { t } = this.props;
    const SNEDMeasures = [
      "efectiveness",
      "overcoming",
      "fairness",
      "improvement",
      "initiative",
      "integration"
    ];

    // source tooltip
    const SNEDTooltipContent = (
      <div className="source-tooltip sned-tooltip">
        {/* loop through measures */}
        {SNEDMeasures.map(measure => (
          <div key={measure.title} className="sned-tooltip-measure">
            <h4 className="sned-tooltip-subhead font-xs">
              {t(`geo_profile.education.sned.definitions.${measure}.title`)}
            </h4>
            <p className="sned-tooltip-body font-xxs">
              {t(`geo_profile.education.sned.definitions.${measure}.desc`)}
            </p>
          </div>
        ))}

        <h4 className="sned-tooltip-heading source-tooltip-heading font-xs">
          {t("source")}:
        </h4>

        <SourceNote cube="sned_website" />

        <p className="sned-tooltip-disclaimer font-xxs">
          {t("geo_profile.education.sned.disclaimer")}
        </p>
      </div>
    );

    return (
      <Tooltip2
        className="sned-tooltip-trigger source-tooltip-trigger"
        content={SNEDTooltipContent}
        placement="auto"
        useSmartArrowPositioning={false}
        useSmartPositioning={true}
      >
        <a
          href="https://www.ayudamineduc.cl/ficha/descripcion-general-sned"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="pt-icon pt-icon-info-sign" />
        </a>
      </Tooltip2>
    );
  }
}

// SNEDTooltip.defaultProps = {
//   key: "value"
// };

export default translate()(SNEDTooltip);
