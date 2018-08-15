import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";

import { RDTypesColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import TreemapStacked from "components/TreemapStacked";

class RDByOwnershipType extends Section {
  state = {
    treemap: true
  };

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
    const path = this.context.data.industry_rd_by_ownership_type;
    const industry = this.context.data.industry;

    const locale = i18n.language;

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
        <TreemapStacked
          path={path}
          msrName="Total Spending"
          drilldowns={["Ownership Type", "Ownership Type"]}
          config={{
            label: d => d["Ownership Type"],
            total: d => d["Total Spending"],
            totalConfig: {
              text: d =>
                "Total: US " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "($0,.[00]a)"
                )
            },
            shapeConfig: {
              fill: d => RDTypesColorScale("ot" + d["ID Ownership Type"])
            },
            tooltipConfig: {
              title: d => d["Ownership Type"],
              body: d =>
                numeral(d["Total Spending"], locale).format("(USD 0a)")
            },
            yConfig: {
              title: t("US$"),
              tickFormat: tick => numeral(tick, locale).format("(0a)")
            }
          }}
        />

        <SourceNote cube="rd_survey" />
      </div>
    );
  }
}

export default translate()(RDByOwnershipType);
