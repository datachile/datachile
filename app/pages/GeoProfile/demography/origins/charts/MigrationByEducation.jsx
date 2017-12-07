import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { Treemap } from "d3plus-react";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

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

    const locale = i18n.locale;

    const path = this.context.data.path_country_migration_by_education;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Migration By Educational Level")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: "ID Education",
            label: d => d["Education"],
            sum: d => d["Number of visas"],
            total: d => d["Number of visas"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(d.text.split(": ")[1], locale).format("0,0") +
                t(" immigrants")
            },
            time: "ID Year",
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
            legendConfig: {
              label: false,
              shapeConfig: false
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(MigrationByEducation);
