import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { RDTypesColorScale } from "helpers/colors";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class RDByOwnershipType extends Section {
  static need = [
    (params, store) => {
      var industry = getLevelObject(params);
      industry.level2 = false;
      const prm = mondrianClient.cube("rd_survey").then(cube => {
        var q = levelCut(
          industry,
          "ISICrev4",
          "ISICrev4",
          cube.query
            .option("parents", true)
            .drilldown("Ownership Type", "Ownership Type", "Ownership Type")
            .drilldown("Date", "Date", "Year")
            .measure("Total Spending"),
          "Level 1",
          "Level 2",
          store.i18n.locale
        );

        return {
          key: "industry_rd_by_ownership_type",
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
    const path = this.context.data.industry_rd_by_ownership_type;
    const industry = this.context.data.industry;

    const locale = i18n.locale;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Total R&D spending by Ownership Type")}
            {industry &&
              industry.parent && (
                <span>
                  :{" "}
                  {industry.parent ? industry.parent.caption : industry.caption}
                </span>
              )}
          </span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Ownership Type"],
            label: d => d["Ownership Type"],
            sum: d => d["Total Spending"],
            time: "ID Year",
            shapeConfig: {
              fill: d => RDTypesColorScale("ot" + d["ID Ownership Type"])
            },
            tooltipConfig: {
              title: d => d["Ownership Type"],
              body: d =>
                numeral(d["Total Spending"], locale).format("(USD 0 a)")
            },
            legendConfig: {
              shapeConfig: {
                width: 20,
                height: 20
              }
            }
          }}
          dataFormat={data => data.data}
        />
        <SourceNote cube="rd_survey" />
      </div>
    );
  }
}

export default translate()(RDByOwnershipType);
