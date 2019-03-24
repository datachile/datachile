import React from "react";
import { Section } from "@datawheel/canon-core";
import { translate } from "react-i18next";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

import TreemapStacked from "components/TreemapStacked";

class EmergencyByAge extends Section {
  render() {
    const { t, className, i18n } = this.props;
    const { geo } = this.context.data;

    const locale = i18n.language;
    const classSvg = "emergency-care";

    const geoType =
      geo.type.substring(0, 1).toUpperCase() + geo.type.substring(1);
    const path = `/api/data?measures=Total&drilldowns=Age,Year&parents=true`;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Emergency Care By Age")}
            <SourceTooltip cube="immigration" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <TreemapStacked
          path={path}
          msrName="Total"
          drilldowns={["Age"]}
          className={classSvg}
          config={{
            height: 400,
            data: path,
            groupBy: "Name-L3",
            // label: d => d["Activity"],
            legendConfig: {
              label: false,
              shapeConfig: false
            }
          }}
        />
      </div>
    );
  }
}

export default translate()(EmergencyByAge);
