import React from "react";
import { Section } from "@datawheel/canon-core";
import { translate } from "react-i18next";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

import TreemapStacked from "components/TreemapStacked";

import { EMERGENCY_CARE } from "helpers/colors";
import { numeral } from "helpers/formatters";

class Emergency extends Section {
  render() {
    const { t, className, i18n } = this.props;
    const { geo } = this.context.data;

    const locale = i18n.language;
    const classSvg = "emergency-care";

    let dd = undefined;
    let key = undefined;
    if (geo.depth > 0) {
      dd = "Region";
      key = geo.depth === 2 ? geo.ancestor.key : geo.key;
    }
    let path = `/api/data?measures=Total&drilldowns=Name-L3,Year&parents=true&Year=2009,2010,2011,2012,2013,2014,2015,2016,2017,2018&captions=${locale}`;
    if (dd) path += `&${dd}=${key}`;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Emergency Care by Patology")}
            <SourceTooltip cube="emergency_care" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <TreemapStacked
          path={path}
          msrName="Total"
          drilldowns={["Cause-L2", "Name-L3"]}
          className={classSvg}
          config={{
            height: 400,
            data: path,
            shapeConfig: {
              fill: d => EMERGENCY_CARE[d["ID Cause-L2"]] || "gray"
            },
            tooltipConfig: {
              tbody: [
                [
                  t("Emergency Care"),
                  d => numeral(d["Total"], locale).format("0,0")
                ],
                [t("Year"), d => d["Year"]]
              ]
            },
            legend: false,
            legendConfig: {
              label: false,
              shapeConfig: false
            }
          }}
          dataFormat={resp => resp.data.filter(d => d["ID Year"] > 2009 && d["ID Year"] < 2019)}
        />
      </div>
    );
  }
}

export default translate()(Emergency);
