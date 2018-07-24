import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import { COLORS_GENDER } from "helpers/colors";
import { simpleGeoChartNeed } from "helpers/MondrianClient";

import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class PSUResultsBySex extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_higher_psu_by_sex",
      "psu",
      ["Number of records", "Avg language test", "Avg math test"],
      {
        drillDowns: [["Sex", "Sex", "Sex"], ["Date", "Date", "Year"]],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;

    const locale = i18n.language;
    const classSvg = "psu-results-by-sex";

    const path = this.context.data.path_higher_psu_by_sex;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("PSU Results By Sex")}</span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        <BarChart
          className={classSvg}
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
                backgroundImage: d => "/images/legend/sex/" + d.id_sex + ".png"
              }
            },
            tooltipConfig: {
              body: d =>
                d.item +
                ": " +
                numeral(d.value, locale).format("0,0.[0]") +
                " " +
                t("Points")
            }
          }}
          dataFormat={data => {
            const reduced = data.data.reduce((all, item) => {
              all.push({
                value: item["Avg language test"],
                item: t("Language_PSU"),
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
