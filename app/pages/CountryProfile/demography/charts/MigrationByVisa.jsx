import React from "react";
import { Section } from "datawheel-canon";

import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";

class MigrationByVisa extends Section {
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
          "Subregion",
          "Country",
          store.i18n.locale,
          false
        );

        return {
          key: "path_country_migration_by_visa",
          data: store.env.CANON_API + q.path("jsonrecords")
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
    const locale = i18n.locale;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Migration By Visa")}</span>
          <ExportLink path={path} />
        </h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: "ID Visa Type",
            label: d => d["Visa Type"],
            time: "ID Year",
            y: "Visa Type",
            x: "Number of visas",
            discrete: "y",
            shapeConfig: {
              label: false,
              fill: () => ordinalColorScale(3)
            },
            yConfig: {
              tickSize: 0,
              title: false
            },
            xConfig: {
              title: t("Visas"),
              tickFormat: tick => numeral(tick, locale).format("(0.0 a)")
            },
            barPadding: 20,
            groupPadding: 40,
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
          dataFormat={function(data) {
            var filtered = filter(
              data.data,
              o => o["Number of visas"] != null && o["Number of visas"] > 0
            );
            return orderBy(filtered, ["Number of visas"], ["asc"]);
          }}
        />
      </div>
    );
  }
}

export default translate()(MigrationByVisa);
