import React from "react";
import { Section } from "@datawheel/canon-core";
import { withNamespaces } from "react-i18next";
import { BarChart } from "d3plus-react";

import { COLORS_GENDER } from "helpers/colors";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

import { nest } from "d3-collection";
import { sum } from "d3-array";

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
    const { geo } = this.context.data;
    const geoType =
      geo.type.substring(0, 1).toUpperCase() + geo.type.substring(1);

    let path = `/api/data?measures=People&drilldowns=Sex,Age&parents=true&captions=${locale}`;
    if (geo.depth > 0) path += `&${geoType}=${geo.key}`;

    const classSvg = "population-pyramid";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Population Pyramid")}
            <SourceTooltip cube="census" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <BarChart
          className={classSvg}
          config={{
            height: 400,
            data: path,
            groupBy: "ID Sex",
            label: d => d["Sex"],
            // time: "ID Year",
            x: "People",
            y: "Age Range",
            discrete: "y",
            stacked: true,
            shapeConfig: {
              fill: d => COLORS_GENDER[d["ID Sex"]]
            },
            // timeFilter: d => d.Year === "2018",
            total: d => Math.abs(d["People"]),
            totalConfig: {
              text: d => d.text + " " + t("people")
            },
            yConfig: {
              title: t("Age Range")
              // tickFormat: d => d["Age Range"]
            },
            xConfig: {
              tickFormat: tick =>
                numeral(Math.abs(tick), locale).format("0,0.[0] a"),
              title: false
            },
            tooltipConfig: {
              title: d => d["Sex"],
              body: d =>
                d["People"] instanceof Array
                  ? ""
                  : numeral(Math.abs(d["People"]), locale).format("( 0,0 )") +
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
            const buckets = {
              1: Object.assign(
                [],
                [
                  { title: "0 - 4", range: [0, 4], value: 0 },
                  { title: "5 - 9", range: [5, 9], value: 0 },
                  { title: "10 - 14", range: [10, 14], value: 0 },
                  { title: "15 - 19", range: [15, 19], value: 0 },
                  { title: "20 - 24", range: [20, 24], value: 0 },
                  { title: "25 - 29", range: [25, 29], value: 0 },
                  { title: "30 - 34", range: [30, 34], value: 0 },
                  { title: "35 - 39", range: [35, 39], value: 0 },
                  { title: "40 - 44", range: [40, 44], value: 0 },
                  { title: "45 - 49", range: [45, 49], value: 0 },
                  { title: "50 - 54", range: [50, 54], value: 0 },
                  { title: "55 - 59", range: [55, 59], value: 0 },
                  { title: "60 - 64", range: [60, 64], value: 0 },
                  { title: "65 - 69", range: [65, 69], value: 0 },
                  { title: "70 - 74", range: [70, 74], value: 0 },
                  { title: "75 - 79", range: [75, 79], value: 0 },
                  { title: "80 - +", range: [80, Infinity], value: 0 }
                ]
              ),
              2: Object.assign(
                [],
                [
                  { title: "0 - 4", range: [0, 4], value: 0 },
                  { title: "5 - 9", range: [5, 9], value: 0 },
                  { title: "10 - 14", range: [10, 14], value: 0 },
                  { title: "15 - 19", range: [15, 19], value: 0 },
                  { title: "20 - 24", range: [20, 24], value: 0 },
                  { title: "25 - 29", range: [25, 29], value: 0 },
                  { title: "30 - 34", range: [30, 34], value: 0 },
                  { title: "35 - 39", range: [35, 39], value: 0 },
                  { title: "40 - 44", range: [40, 44], value: 0 },
                  { title: "45 - 49", range: [45, 49], value: 0 },
                  { title: "50 - 54", range: [50, 54], value: 0 },
                  { title: "55 - 59", range: [55, 59], value: 0 },
                  { title: "60 - 64", range: [60, 64], value: 0 },
                  { title: "65 - 69", range: [65, 69], value: 0 },
                  { title: "70 - 74", range: [70, 74], value: 0 },
                  { title: "75 - 79", range: [75, 79], value: 0 },
                  { title: "80 - +", range: [80, Infinity], value: 0 }
                ]
              )
            };
            const results = data.data;
            nest()
              .key(d => d["ID Sex"])
              .entries(results)
              .forEach(group => {
                group.values.forEach(h => {
                  const i = buckets[group.key].findIndex(
                    d => d.range[0] <= h["ID Age"] && d.range[1] >= h["ID Age"]
                  );
                  buckets[group.key][i].value += h["People"];
                });
              });

            const female = data.data.find(d => d["ID Sex"] === 1);
            const male = data.data.find(d => d["ID Sex"] === 2);

            const output = [];
            Object.keys(buckets).forEach(x => {
              buckets[x].forEach(d => {
                const sex = x === "1" ? female : male;
                const item = {
                  People: x === "1" ? parseInt(d.value) * -1 : d.value,
                  Sex: sex.Sex,
                  "ID Sex": sex["ID Sex"],
                  "Age Range": d.title
                };
                output.push(item);
              });
            });
            return output;
          }}
        />
      </div>
    );
  }
}

export default withNamespaces()(PopulationPyramid);
