import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import { COLORS_GENDER } from "helpers/colors";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class PopulationPyramid extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_population_projection",
      "population_estimate",
      ["Population"],
      {
        drillDowns: [
          ["Age Range", "Age Range", "Age Range"],
          ["Sex", "Sex", "Sex"],
          ["Date", "Date", "Year"]
        ],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;
    const locale = i18n.language;

    const path = this.context.data.path_population_projection;
    const age_range = [
      "0 - 4",
      "5 - 9",
      "10 - 14",
      "15 - 19",
      "20 - 24",
      "25 - 29",
      "30 - 34",
      "35 - 39",
      "40 - 44",
      "45 - 49",
      "50 - 54",
      "55 - 59",
      "60 - 64",
      "65 - 69",
      "70 - 74",
      "75 - 79",
      "80 +"
    ];

    const classSvg = "population-pyramid";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Population Pyramid")}</span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <BarChart
          className={classSvg}
          config={{
            width:
              typeof window !== "undefined" &&
              document.querySelector("." + classSvg)
                ? document.querySelector("." + classSvg).clientWidth
                : undefined,
            height: 500,
            data: path,
            groupBy: "ID Sex",
            label: d => d["Sex"],
            time: "ID Year",
            x: "Population",
            y: "ID Age Range",
            discrete: "y",
            stacked: true,
            shapeConfig: {
              fill: d => COLORS_GENDER[d["ID Sex"]]
            },
            timeFilter: d => d.Year === "2018",
            total: d => Math.abs(d["Population"]),
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "0,0"
                ) +
                " " +
                t("people")
            },
            yConfig: {
              title: t("Age Range"),
              tickFormat: tick => t(age_range[tick - 1])
            },
            xConfig: {
              tickFormat: tick =>
                numeral(Math.abs(tick), locale).format("0,0.[0] a"),
              title: false
            },
            tooltipConfig: {
              title: d => d["Sex"],
              body: d =>
                d["Population"] instanceof Array
                  ? ""
                  : numeral(Math.abs(d["Population"]), locale).format(
                      "( 0,0 )"
                    ) +
                    " " +
                    t("people")
            },
            legendConfig: {
              label: d => d["Sex"],
              shapeConfig: {
                backgroundImage: d =>
                  "/images/legend/sex/" + d["ID Sex"] + ".png"
              }
            }
          }}
          dataFormat={data => {
            var output = data.data.reduce((all, item) => {
              let elm =
                item["ID Sex"] === 1
                  ? { ...item, Population: parseInt(item.Population) * -1 }
                  : { ...item };
              all.push(elm);
              return all;
            }, []);
            return output;
          }}
        />
        <SourceNote cube="population_estimate" />
      </div>
    );
  }
}

export default translate()(PopulationPyramid);
