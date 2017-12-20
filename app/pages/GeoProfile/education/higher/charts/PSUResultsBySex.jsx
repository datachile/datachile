import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import { COLORS_GENDER } from "helpers/colors";
import { simpleGeoChartNeed } from "helpers/MondrianClient";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class PSUResultsBySex extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_higher_psu_by_sex",
      "psu",
      ["Avg language test", "Avg math test"],
      {
        drillDowns: [["Sex", "Sex", "Sex"], ["Date", "Date", "Year"]],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className } = this.props;

    const path = this.context.data.path_higher_psu_by_sex;

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
            groupBy: "id_sex",
            label: d => t(d["sex"]),
            x: "item",
            y: "value",
            time: "year",
            shapeConfig: {
              fill: d => COLORS_GENDER[d["id_sex"]],
              label: d => d["sex"]
            },
            xConfig: {
              title: false
            },
            yConfig: {
              title: "PSU"
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d => "/images/legend/sex/" + d.id_sex + ".png"
              }
            }
          }}
          dataFormat={data => {
            const reduced = data.data.reduce((all, item) => {
              all.push({
                value: item["Avg language test"],
                item: t("Language"),
                sex: item["Sex"],
                id_sex: item["ID Sex"],
                year: item["Year"]
              });
              all.push({
                value: item["Avg math test"],
                item: t("Math"),
                sex: item["Sex"],
                id_sex: item["ID Sex"],
                year: item["Year"]
              });
              return all;
            }, []);
            return reduced;
          }}
        />
        <SourceNote cube="psu" />
      </div>
    );
  }
}

export default translate()(PSUResultsBySex);
