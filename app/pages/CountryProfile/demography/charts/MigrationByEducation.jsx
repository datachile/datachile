import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { Treemap } from "d3plus-react";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";

class MigrationByEducation extends Section {
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
            .drilldown("Education", "Education")
            .measure("Number of visas"),
          "Subregion",
          "Country",
          store.i18n.locale,
          false
        );

        return {
          key: "path_country_migration_by_education",
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
            time: "ID Year",
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID Education"])
            },
            total: d => d["Number of visas"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(d.text.split(": ")[1], locale).format("(0,0)") +
                " " +
                t("visas")
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
