import React from "react";
import { Section } from "@datawheel/canon-core";
import { translate } from "react-i18next";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

import TreemapStacked from "components/TreemapStacked";
import axios from "axios";

import { EDUCATION_COLORS } from "helpers/colors";

class AbandonmentTotal extends Section {
  constructor(props) {
    super(props);
    this.state = {
      selected: 1
    };
  }
  componentDidMount() {
    // axios.get()
  }
  render() {
    const { t, className, i18n } = this.props;
    const { geo } = this.context.data;
    const { selected } = this.state;

    const locale = i18n.language;
    const classSvg = "abandonment-total";

    const geoType =
      geo.type.substring(0, 1).toUpperCase() + geo.type.substring(1);

    // ${geoType}=${geo.key}

    let path = `/api/data?measures=Number of Students&drilldowns=Promotion Status,Education Level,Year&parents=true`;
    if (geo.depth > 0) path += `&${geoType}=${geo.key}`;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("School Abandonment Total")}
            <SourceTooltip cube="mds_abandonment_rate" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <TreemapStacked
          depth={true}
          forceUpdate={true}
          path={path}
          msrName="Number of Students"
          drilldowns={["Education Level"]}
          className={classSvg}
          defaultChart="stacked"
          config={{
            height: 400,
            data: path,
            legend: false,
            shapeConfig: {
              fill: d => EDUCATION_COLORS[d["ID Education Level"] - 1]
            },
            tooltipConfig: {
              // tbody: [[t("Number of Students"), d => d["Number of Students"]]],
              body: d =>
                "<div>" +
                `<div>${t("Number of Students")}: ${d["Number of Students"]} ${t("dropouts")}</div>` +
                `<div>${t("Year")}: ${d["Year"]}</div>` +
                "</div>"
            },
            legendConfig: {
              label: false,
              shapeConfig: false
            },
            yConfig: {
              // tickFormat: tick => numeral(tick, locale).format("(0)")
            }
          }}
        />
      </div>
    );
  }
}

export default translate()(AbandonmentTotal);
