import React from "react";
import { Section } from "datawheel-canon";
import { LinePlot } from "d3plus-react";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, {
  simpleIndustryChartNeed,
  levelCut
} from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class EmployedByCategory extends Section {
  static need = [
    simpleIndustryChartNeed(
      "path_industry_employed_by_category",
      "nene",
      ["Expansion factor"],
      {
        drillDowns: [["Date", "Date", "Year"], ["ICSE", "ICSE", "ICSE"]],
        options: { parents: false }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.path_industry_employed_by_category;
    console.log(this.context.data)
    const industry = this.context.data.industry;

    const locale = i18n.locale;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Employment by Category")}</span>
          <ExportLink path={path} />
        </h3>
        <LinePlot
          config={{
            height: 500,
            data: path,
            groupBy: "ICSE",
            x: "ID Year",
            y: "Expansion factor",
            xConfig: {
              tickSize: 0,
              title: false
            },
            yConfig: {
              title: t("Employment by category"),
              tickFormat: tick => numeral(tick, locale).format("0 a")
            },
            shapeConfig: {
              Line: {
                //stroke: d => tradeBalanceColorScale(d["variable"]),
                strokeWidth: 2
              }
            }
          }}
          dataFormat={data => data.data}
        />
        <SourceNote cube="nene" />
      </div>
    );
  }
}

export default translate()(EmployedByCategory);
