import React, { Component } from "react";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { numeral, moneyRangeFormat } from "helpers/formatters";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { COLORS_GENDER } from "helpers/colors";

import ExportLink from "components/ExportLink";

class IncomeBySex extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_income_by_sex",
      "nesi_income",
      ["Expansion Factor"],
      {
        drillDowns: [
          ["Date", "Date", "Year"],
          ["Income Range", "Income Range", "Income Range"],
          ["Sex", "Sex", "Sex"]
        ],
        options: { parents: true }
      }
    )
  ];

  render() {
    const path = this.context.data.path_income_by_sex;
    const { t, className, i18n } = this.props;

    const locale = i18n.locale;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Income By Sex")}</span>
          <ExportLink path={path} />
        </h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: "ID Sex",
            label: d => d["Sex"],
            time: "ID Year",
            x: "Income Range",
            y: "Expansion Factor",
            shapeConfig: {
              fill: d => COLORS_GENDER[d["ID Sex"]],
              label: false
            },
            xConfig: {
              tickSize: 0,
              title: t("Income Range CLP"),
              tickFormat: tick => moneyRangeFormat(tick, locale)
            },
            xSort: (a, b) =>
              a["ID Income Range"] > b["ID Income Range"] ? 1 : -1,
            yConfig: {
              title: t("People"),
              tickFormat: tick => numeral(tick, locale).format("(0 a)")
            },
            barPadding: 0,
            groupPadding: 5,
            tooltipConfig: {
              title: d => {
                var title = d["Sex"];
                title +=
                  d["Income Range"] instanceof Array
                    ? ""
                    : ": " + moneyRangeFormat(d["Income Range"], locale);
                return title;
              },
              body: d =>
                numeral(d["Expansion Factor"], locale).format("(0 a)") +
                " " +
                t("people")
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d =>
                  "/images/legend/sex/" + d["ID Sex"] + ".png"
              }
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(IncomeBySex);
