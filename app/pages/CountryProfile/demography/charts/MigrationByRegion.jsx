import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { Treemap } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

class MigrationByRegion extends Section {
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
            .drilldown("Geography", "Comuna")
            .measure("Number of visas"),
          "Continent",
          "Country",
          store.i18n.locale,
          false
        );

        return {
          key: "path_country_migration_by_region",
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

    const path = this.context.data.path_country_migration_by_region;
    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Migration By Region")}</span>
          <ExportLink path={path} />
        </h3>
        {this.state.chart ? (
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: ["ID Region", "ID Comuna"],
              label: d => d["Comuna"],
              sum: d => d["Number of visas"],
              time: "ID Year",
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
                fill: d => ordinalColorScale(d["ID Region"])
              },
              tooltipConfig: {
                title: d => {
                  return d["Comuna"] instanceof Array
                    ? d["Region"]
                    : d["Comuna"] + " - " + d["Region"];
                },
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
export default translate()(MigrationByRegion);
