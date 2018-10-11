import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import NoDataAvailable from "components/NoDataAvailable";
import TreemapStacked from "components/TreemapStacked";

class MigrationByVisa extends Section {
  state = {
    chart: true
  };

  static need = [
    (params, store) => {
      const country = getLevelObject(params);
      const prm = mondrianClient.cube("immigration").then(cube => {
        const q = levelCut(
          country,
          "Origin Country",
          "Country",
          cube.query
            .option("parents", true)
            .drilldown("Date", "Year")
            .drilldown("Visa Type", "Visa Type")
            .measure("Number of visas"),
          "Continent",
          "Country",
          store.i18n.locale,
          false
        );

        return {
          key: "path_country_migration_by_visa",
          data: __API__ + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { t, className, i18n } = this.props;

    const path = this.context.data.path_country_migration_by_visa;
    const locale = i18n.language;
    const classSvg = "migration-by-visa";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Migration By Visa")}
            <SourceTooltip cube="immigration" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        {this.state.chart ? (
          <TreemapStacked
            depth={true}
            path={path}
            msrName="Number of visas"
            drilldowns={["Visa Type"]}
            className={classSvg}
            config={{
              label: d => d["Visa Type"],
              total: d => d["Number of visas"],
              totalConfig: {
                text: d =>
                  "Total: " +
                  numeral(getNumberFromTotalString(d.text), locale).format(
                    "0,0"
                  ) +
                  " " +
                  t("visas")
              },
              shapeConfig: {
                fill: d => ordinalColorScale(d["ID Visa Type"])
              },
              tooltipConfig: {
                title: d => d["Visa Type"],
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
          />
        ) : (
          <NoDataAvailable />
        )}
      </div>
    );
  }
}

export default translate()(MigrationByVisa);
