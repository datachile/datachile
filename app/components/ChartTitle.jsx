import React from "react";
import { translate } from "react-i18next";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class ChartTitle extends React.Component {
  render() {
    const { cube, t, path, title, className } = this.props;
    return (
      <h3 className="chart-title">
        <span>
          {t(title)}
          <SourceTooltip cube={cube} />
        </span>
        <ExportLink path={path} className={className} />
      </h3>
    );
  }
}

export default translate()(ChartTitle);
