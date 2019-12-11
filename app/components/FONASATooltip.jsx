import React, { Component } from "react";
// import { Link } from "react-router";
import { withNamespaces } from "react-i18next";
import { Tooltip } from "@blueprintjs/core";
import SourceNote from "components/SourceNote";

import "./FONASATooltip.css";

class FONASATooltip extends Component {
  constructor() {
    super();
  }

  render() {
    const { t } = this.props;

    // source tooltip
    const FONASATooltipContent = (
      <div className="source-tooltip fonasa-tooltip">
        <div
          className="fonasa-tooltip-body font-xs"
          dangerouslySetInnerHTML={{
            __html: t("geo_profile.health.fonasa.text")
          }}
        />
        <div
          className="fonasa-tooltip-list font-xs"
          dangerouslySetInnerHTML={{
            __html: t("geo_profile.health.fonasa.tramos")
          }}
        />
        <div
          className="fonasa-tooltip-body font-xs"
          dangerouslySetInnerHTML={{
            __html: t("geo_profile.health.fonasa.copago")
          }}
        />

        <h4 className="fonasa-tooltip-heading source-tooltip-heading font-xs">
          {t("source")}:
        </h4>

        <SourceNote cube="fonasa_website" />
      </div>
    );

    return (
      <Tooltip
        className="fonasa-tooltip-trigger source-tooltip-trigger"
        content={FONASATooltipContent}
        placement="auto"
        useSmartArrowPositioning={false}
        useSmartPositioning={true}
      >
        <a
          href="https://www.fonasa.cl/sites/fonasa/beneficiarios/informacion-general/tramos"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="bp3-icon bp3-icon-info-sign" />
        </a>
      </Tooltip>
    );
  }
}

// FONASATooltip.defaultProps = {
//   key: "value"
// };

export default withNamespaces()(FONASATooltip);
