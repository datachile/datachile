import {Section} from "@datawheel/canon-core";
import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import TreemapStacked from "components/TreemapStacked";
import {crimesColorScale} from "helpers/colors";
import {numeral} from "helpers/formatters";
import {simpleGeoChartNeed} from "helpers/MondrianClient";
import React from "react";
import {withNamespaces} from "react-i18next";

class CrimeTreemap extends Section {
  static need = [
    simpleGeoChartNeed("path_crimes_by_crime", "crimes", ["Cases"], {
      drillDowns: [["Crime", "Crime", "Crime"], ["Date", "Date", "Year"]],
      options: {parents: true}
    })
  ];

  render() {
    const {t, className, i18n} = this.props;

    const path = this.context.data.path_crimes_by_crime;
    const locale = i18n.language;
    const classSvg = "crime-treemap";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Complaints By Crime")}
            <SourceTooltip cube="crimes" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        <TreemapStacked
          defaultChart="stacked"
          depth={true}
          className={classSvg}
          path={path}
          msrName="Cases"
          drilldowns={["Crime Group", "Crime"]}
          config={{
            shapeConfig: {
              fill: d => crimesColorScale("CRIME" + d["ID Crime Group"])
            },
            tooltipConfig: {
              title: d => d["Crime"],
              body: d =>
                "<div>" +
                numeral(d["Cases"], locale).format("0,0") +
                " " +
                t("complaints") +
                "<div>"
            },
            total: d => d["Cases"],
            totalConfig: {
              text: d => `${d.text} ${t("complaints")}`
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                backgroundImage: d =>
                  "/images/legend/crime/" + d["ID Crime Group"] + ".png"
              }
            },
            legendTooltip: {
              title: d => d["Crime Group"]
            }
          }}
        />
      </div>
    );
  }
}

export default withNamespaces()(CrimeTreemap);
