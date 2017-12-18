import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import { COLORS_GENDER } from "helpers/colors";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";

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

    const locale = i18n.locale;

    const path = this.context.data.path_population_projection;
    const age_range = [
      "0 to 4",
      "5 to 9",
      "10 to 14",
      "15 to 19",
      "20 to 24",
      "25 to 29",
      "30 to 34",
      "35 to 39",
      "40 to 44",
      "45 to 49",
      "50 to 54",
      "55 to 59",
      "60 to 64",
      "65 to 69",
      "70 to 74",
      "75 to 79",
      "80 and older"
    ];

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Population Pyramid")}</span>
          <ExportLink path={path} />
        </h3>
        <BarChart
          config={{
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
            total: d => Math.abs(d["Population"]),
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(d.text.split(": ")[1], locale).format("0,0") +
                " " +
                t("people")
            },
            yConfig: {
              title: t("Age Range"),
              tickFormat: tick => age_range[tick - 1]
            },
            xConfig: {
              tickFormat: tick => numeral(Math.abs(tick), locale).format("0,0"),
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
                width: 20,
                height: 20,
                backgroundImage: d =>
                  "/images/legend/sex/" + d["ID Sex"] + ".png"
              }
            }
          }}
          dataFormat={data => {
            var output = data.data.reduce((all, item) => {
              let elm =
                item.Sex === "Female"
                  ? { ...item, Population: parseInt(item.Population) * -1 }
                  : { ...item };
              all.push(elm);
              return all;
            }, []);
            return output;
          }}
        />
      </div>
    );
  }
}

export default translate()(PopulationPyramid);
