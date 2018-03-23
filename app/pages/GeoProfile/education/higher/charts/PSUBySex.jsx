import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import { numeral } from "helpers/formatters";

import { COLORS_GENDER } from "helpers/colors";
import { simpleGeoChartNeed } from "helpers/MondrianClient";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class PSUBySex extends Section {
  static need = [];

  render() {
    const { t, className, i18n } = this.props;

    const locale = i18n.language;
    const classSvg = "psu-by-sex";

    const path = this.context.data.path_higher_psu_by_sex;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("PSU By Sex")}</span>
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
              title: t("PSU exams")
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d => "/images/legend/sex/" + d.id_sex + ".png"
              }
            },
            tooltipConfig: {
              body: d => {
                return (
                  numeral(d.value, locale).format("0,0") + " " + t("PSU exams")
                );
              }
            }
          }}
          dataFormat={data => {
            const reduced = data.data.reduce((all, item) => {
              all.push({
                value: item["Number of records"],
                item: t("Sex"),
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

export default translate()(PSUBySex);
