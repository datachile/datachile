import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { COLORS_GENDER } from "helpers/colors";
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
              .option("sparse", false)
              .drilldown("Date", "Year")
              .drilldown("Sex", "Sex")
              .measure("Number of visas"),
            "Continent",
            "Country",
            store.i18n.locale,
            false
          );

          return {
            key: "path_country_migration_by_sex",
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
        return data.data.map(item => {
          item["Number of visas"] = item["Number of visas"] || 0;
          return item;
        });
      } else {
        this.setState({ chart: false });
      }
    };

    render() {
      const { t, className, i18n } = this.props;

      const path = this.context.data.path_country_migration_by_sex;
      const locale = i18n.language;
      const classSvg = "migration-by-sex";

      return (
        <div className={className}>
          <h3 className="chart-title">
            <span>{t("Migration By Sex")}</span>
            <ExportLink path={path} className={classSvg} />
          </h3>
          {this.state.chart ? (
            <BarChart
              className={classSvg}
              config={{
                height: 400,
                data: path,
                groupBy: "ID Sex",
                label: d => d["Sex"],
                time: "ID Year",
                x: "Sex",
                y: "Number of visas",
                shapeConfig: {
                  fill: d => COLORS_GENDER[d["ID Sex"]]
                },
                xConfig: {
                  tickSize: 0,
                  title: false,
                  tickFormat: tick => ""
                },
                yConfig: {
                  title: t("Visas"),
                  tickFormat: tick => numeral(tick, locale).format("(0.0a)")
                },
                barPadding: 20,
                groupPadding: 40,
                tooltipConfig: {
                  title: d => d["Sex"],
                  body: d =>
                    numeral(d["Number of visas"], locale).format("( 0,0 )") +
                    " " +
                    t("visas")
                },
                legendConfig: {
                  label: false,
                  shapeConfig: {
                    backgroundImage: d =>
                      "/images/legend/sex/" + d["ID Sex"] + ".png"
                  }
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
