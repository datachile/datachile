import React from "react";
import { Section } from "@datawheel/canon-core";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { employmentBySexColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
// import CustomStackedArea from "components/CustomStackedArea";

import { StackedArea } from "d3plus-react";

class EmploymentBySex extends Section {
  static need = [
    (params, store) => {
      return simpleGeoChartNeed(
        "path_employment_by_sex",
        "nene_quarter",
        ["Expansion factor"],
        {
          drillDowns: [
            [
              "Occupational Situation",
              "Occupational Situation",
              "Occupational Situation"
            ],
            ["Sex", "Sex", "Sex"],
            ["Date", "Date", "Moving Quarter"]
          ]
        }
      )(params, store);
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 0,
      selectedObj: {
        path: "",
        groupBy: [],
        label: () => "",
        sum: () => "",
        sex_id: 1
      },
      chartVariations: []
    };
  }

  componentDidMount() {
    const { t } = this.props;

    const variations = [
      {
        id: 0,
        title: t("Female"),
        sex_id: 1
      },
      {
        id: 1,
        title: t("Male"),
        sex_id: 2
      }
    ];

    this.setState({
      selectedOption: 0,
      selectedObj: variations[0],
      chartVariations: variations
    });
  }

  render() {
    const { t, className, i18n } = this.props;
    const { chartVariations, selectedObj, selectedOption } = this.state;

    const path = this.context.data.path_employment_by_sex;
    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Regional Employment By Sex")}
            <SourceTooltip cube="nene" />
          </span>
          <ExportLink path={path} />
        </h3>
        <StackedArea
          forceUpdate={this.state.selectedObj.sex_id}
          config={{
            height: 400,
            data: path,
            groupBy: ["variable"],
            label: d => d["variable"],
            filter: d => d.__SEX__ === this.state.selectedObj.sex_id,
            x: "month",
            y: "percentage",
            time: "month",
            timeline: false,
            scale: "time",
            xConfig: {
              title: false
            },
            yConfig: {
              title: t("People"),
              tickFormat: tick => numeral(tick, locale).format("0%")
            },
            shapeConfig: {
              fill: d => employmentBySexColorScale("bysex" + d["variable"])
            },
            tooltipConfig: {
              title: d => d["variable"],
              body: d => {
                return d["month"] instanceof Array
                  ? ""
                  : numeral(d["percentage"], locale).format("0.[0]%") +
                      " " +
                      t("people") +
                      "<br/>" +
                      t("Mobile Quarter") +
                      " " +
                      d["quarter"];
              }
            }
          }}
          dataFormat={data => {
            const dataBySex = data.data.reduce(
              (all, item) => {
                all[item["ID Sex"]].push(item);
                return all;
              },
              { "1": [], "2": [] }
            );

            const output = [];

            Object.keys(dataBySex).forEach(d => {
              var melted = [];
              var total = {};

              dataBySex[d].forEach(f => {
                if (total[f["ID Moving Quarter"]]) {
                  total[f["ID Moving Quarter"]] += f["Expansion factor"];
                } else {
                  total[f["ID Moving Quarter"]] = f["Expansion factor"];
                }
                var a = f;
                var date = f["ID Moving Quarter"].split("_");
                f["month"] = date[0] + "-" + date[1] + "-01";
                f["quarter"] =
                  date[0] +
                  " (" +
                  date[1] +
                  "," +
                  date[2] +
                  "," +
                  date[3] +
                  ")";
                a["variable"] = f["Occupational Situation"];
                a["value"] = f["Expansion factor"];
                melted.push(a);
              });

              melted = melted
                .map(m => {
                  m["percentage"] = m["value"] / total[m["ID Moving Quarter"]];
                  m.__SEX__ = parseInt(d);
                  return m;
                })
                .sort((a, b) => {
                  return a["Month"] > b["Month"] ? 1 : -1;
                });

              output.push(...melted);
            });

            return output;
          }}
        />

        <div className="btn-group">
          {chartVariations.map(variation => (
            <button
              key={variation.id}
              className={`btn font-xxs ${
                selectedOption === variation.id ? "is-active" : "is-inactive"
              }`}
              onClick={() => this.setState({
                  selectedOption: variation.id,
                  selectedObj: this.state.chartVariations[variation.id]
                })
              }
            >
              <span className="btn-icon">
                <img src={`/images/legend/sex/${variation.id + 1}.png`} alt=""/>
              </span>
              <span className="btn-text">{variation.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default translate()(EmploymentBySex);
