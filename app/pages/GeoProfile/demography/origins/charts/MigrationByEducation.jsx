import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import TreemapStacked from "components/TreemapStacked";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { ordinalColorScale } from "helpers/colors";
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
    const drilldown = encodeURIComponent(`[Education].[Education].[Education]`);

    if (onSharedStateChange)
      onSharedStateChange({
        key: sharedKey,
        value:
          "string" == typeof sharedValue && sharedValue.indexOf(drilldown) > -1
            ? null
            : `&cut%5B%5D=${drilldown}.%26%5B${point["ID Education"]}%5D`
      });
  };

  render() {
    const { t, className, i18n, sharedValue } = this.props;
    const locale = i18n.locale;

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
          config={{
            on: { click: this.setCurrentSelection },
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
              fill: d => ordinalColorScale(d["ID Education"])
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
