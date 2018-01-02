import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

export default translate()(
  class MigrationBySex extends Section {
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
              .drilldown("Calculated Age Range", "Age Range")
              .measure("Number of visas"),
            "Continent",
            "Country",
            store.i18n.locale,
            false
          );

          return {
            key: "path_country_migration_by_age",
            data: __API__ + q.path("jsonrecords")
          };
        });

        return {
          type: "GET_DATA",
          promise: prm
        };
      }
    ];

    prepareData = data => {
      if (data.data && data.data.length) {
        return data.data;
      } else {
        this.setState({ chart: false });
      }
    };

    render() {
      const { t, className, i18n } = this.props;

      const locale = i18n.language;

      const path = this.context.data.path_country_migration_by_age;

      return (
        <div className={className}>
          <h3 className="chart-title">
            <span>{t("Migration By Calculated Age Range")}</span>
            <ExportLink path={path} />
          </h3>
          {this.state.chart ? (
            <BarChart
              config={{
                height: 500,
                data: path,
                groupBy: "ID Age Range",
                label: d => d["Calculated Age Range"],
                time: "ID Year",
                x: "Age Range",
                y: "Number of visas",
                shapeConfig: {
                  fill: () => ordinalColorScale(2)
                },
                xConfig: {
                  tickSize: 0,
                  title: false
                },
                yConfig: {
                  title: t("Visas"),
                  tickFormat: tick => numeral(tick, locale).format("(0.0 a)")
                },
                barPadding: 20,
                groupPadding: 40,
                tooltipConfig: {
                  title: d => d["Calculated Age Range"],
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
              dataFormat={this.prepareData}
            />
          ) : (
            <NoDataAvailable />
          )}
          <SourceNote cube="immigration" />
        </div>
      );
    }
  }
);
