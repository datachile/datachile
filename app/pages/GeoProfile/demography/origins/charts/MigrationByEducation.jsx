import React from "react";
import { Section } from "@datawheel/canon-core";
import { withNamespaces } from "react-i18next";
import TreemapStacked from "components/TreemapStacked";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { migrationByEducationColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceTooltip from "components/SourceTooltip";
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

  render() {
    const { t, className, i18n } = this.props;

    const locale = i18n.language;

    const path = this.context.data.path_country_migration_by_education;
    const classSvg = "migration-by-education";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Migration By Educational Level")}
            <SourceTooltip cube="immigration" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <TreemapStacked
          className={classSvg}
          path={path}
          msrName="Number of visas"
          drilldowns={["Education", "Education"]}
          depth={true}
          config={{
            height: 400,
            data: path,
            label: d => d["Education"],
            total: d => d["Number of visas"],
            totalConfig: {
              text: d => `${d.text} ${t("visas")}`
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
      </div>
    );
  }
}

export default withNamespaces()(MigrationByEducation);
