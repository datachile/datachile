import {Section} from "@datawheel/canon-core";
import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import TreemapStacked from "components/TreemapStacked";
import {snedComparisonColorScale} from "helpers/colors";
import {numeral} from "helpers/formatters";
import {simpleGeoChartNeed} from "helpers/MondrianClient";
import React from "react";
import {withNamespaces} from "react-i18next";

class SNEDSchoolByClusters extends Section {
  static need = [
    simpleGeoChartNeed("path_sned_indicators", "education_sned", ["Number of records"], {
      drillDowns: [["Cluster", "Cluster", "Stage 2"], ["Date", "Year"]],
      options: {parents: true}
    })
  ];

  render() {
    const {t, className, i18n} = this.props;
    const geo = this.context.data.geo;
    const locale = i18n.language;
    const path = this.context.data.path_sned_indicators;

    const title = t("Total schools by type");
    const classSvg = "sned-school-by-clusters";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {title}
            <SourceTooltip cube="sned" />
          </span>
          <ExportLink path={path} className={classSvg} title={title} />
        </h3>
        <TreemapStacked
          path={path}
          className={classSvg}
          msrName="Number of records"
          drilldowns={["Stage 1a"]}
          config={{
            legendConfig: {
              label: false,
              shapeConfig: {
                backgroundImage: "/images/legend/education/type.png"
              }
            },
            legendTooltip: {
              title: d =>
                "<div style='display: flex; align-items: center; justify-content: center;'><img height='30px' src='/images/legend/education/type.png'/>" +
                d["Stage 1a"] +
                "</div>"
            },
            shapeConfig: {
              fill: d => snedComparisonColorScale("sned" + d["ID Stage 1a"])
            },
            tooltipConfig: {
              body: d =>
                numeral(d["Number of records"], locale).format("0") + " " + t("Schools")
            },
            total: d => d["Number of records"],
            totalConfig: {
              text: d => d.text + " " + t("Schools")
            },
            yConfig: {
              title: t("US$"),
              tickFormat: tick => numeral(tick, locale).format("(0a)")
            }
          }}
        />
      </div>
    );
  }
}

export default withNamespaces()(SNEDSchoolByClusters);
