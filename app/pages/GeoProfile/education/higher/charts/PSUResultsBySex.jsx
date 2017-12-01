import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";
import { mean } from "d3-array";

import { ordinalColorScale } from "helpers/colors";
import mondrianClient, {
  geoCut,
  simpleGeoChartNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";

class PSUResultsBySex extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_higher_psu_by_sex",
      "psu",
      ["PSU Average", "Avg language test", "Avg math test"],
      {
        drillDowns: [["Sex", "Sex", "Sex"], ["Date", "Date", "Year"]],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;

    const path = this.context.data.path_higher_psu_by_sex;
    if (!i18n.language) return null;
    const locale = i18n.language.split("-")[0];

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("PSU Results By Sex")}</span>
          <ExportLink path={path} />
        </h3>

        <BarChart
          config={{
            height: 500,
            data: path,
            aggs: {
              value: mean
            },
            groupBy: "item",
            label: d => t(d["item"]),
            x: "sex",
            y: "value",
            time: "Year",
            shapeConfig: {
              fill: d => ordinalColorScale(d["item"])
            },
            xConfig: {
              title: false
            },
            /*tooltipConfig: {
                title: d => {
                  d["Country"] =
                    d["Country"] == "Chile" ? ["Chile"] : d["Country"];
                  return d["Country"] instanceof Array
                    ? d["Continent"]
                    : d["Country"];
                },
                body: d =>
                  numeral(d["Casualities Count SUM"], locale).format("(0 a)") +
                  " " +
                  t("people")
              },*/

            legendConfig: {
              shapeConfig: {
                width: 40,
                height: 40
              }
            }
          }}
          dataFormat={data => {
            return data.data.reduce((all, item) => {
              all.push({
                value: item["Avg language test"],
                item: "Language",
                sex: item["Sex"],
                Year: item["Year"]
              });
              all.push({
                value: item["Avg math test"],
                item: "Math",
                sex: item["Sex"],
                Year: item["Year"]
              });
              console.log(all);
              return all;
            }, []);
          }}
        />
      </div>
    );
  }
}

export default translate()(PSUResultsBySex);
