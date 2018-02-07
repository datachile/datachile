import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import TreemapStacked from "components/TreemapStacked";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { migrationByEducationColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";

class MigrationByEducation extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_country_migration_by_education",
      "immigration",
      ["Number of visas"],
      {
        drillDowns: [["Date", "Year"], ["Education", "Education", "Education"]],
        options: { parents: true }
      }
    )
  ];

  setCurrentSelection = point => {
    const { onSharedStateChange, sharedKey, sharedValue } = this.props;
    const points = [].concat(point["ID Country"]);
    const drilldown = encodeURIComponent(
      `[Origin Country].[Country].[Country]`
    );

    if (onSharedStateChange)
      onSharedStateChange({
        key: sharedKey,
        value:
          "string" == typeof sharedValue && sharedValue.includes(drilldown)
            ? null
            : "&cut%5B%5D=" +
              (points.length == 1
                ? `${drilldown}.%26%5B${points}%5D`
                : `%7B${points.map(p => `${drilldown}.%26%5B${p}%5D`)}%7D`)
      });
  };

  render() {
    const { t, className, i18n, sharedValue } = this.props;
    const locale = i18n.language;

    let path = this.context.data.path_country_migration_by_education;
    if (sharedValue) path = path.replace("&cut", sharedValue + "&cut");

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Migration By Educational Level")}</span>
          <ExportLink path={path} />
        </h3>
        <TreemapStacked
          path={path}
          msrName="Number of visas"
          drilldowns={["Education", "Education"]}
          depth={true}
          on={{ click: this.setCurrentSelection }}
          config={{
            height: 500,
            data: path,
            label: d => d["Education"],
            total: d => d["Number of visas"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(d.text.split(": ")[1], locale).format("0,0") +
                " " +
                t("visas")
            },
            shapeConfig: {
              fill: d =>
                migrationByEducationColorScale("miged" + d["ID Education"])
            },
            tooltipConfig: {
              title: d => d["Education"],
              body: d =>
                numeral(d["Number of visas"], locale).format("( 0,0 )") +
                " " +
                t("visas")
            },
            legend: false,
            legendConfig: {
              label: false,
              shapeConfig: false
            },
            yConfig: {
              title: t("Number of visas"),
              tickFormat: tick => numeral(tick, locale).format("0,0")
            }
          }}
        />
        <SourceNote cube="immigration" />
      </div>
    );
  }
}

export default translate()(MigrationByEducation);
