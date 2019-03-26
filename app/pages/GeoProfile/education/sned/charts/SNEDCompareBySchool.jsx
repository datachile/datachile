import React from "react";
import { Section } from "@datawheel/canon-core";
import { translate } from "react-i18next";

import { colorContrast } from "d3plus-color";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";
import { snedColorScale } from "helpers/colors";
import { sources } from "helpers/consts";

import { mean } from "d3-array";

import Select from "components/Select";
import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import { BarChart } from "d3plus-react";

import CustomDialog from "components/CustomDialog";

class SNEDCompareBySchool extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_sned_compare_by_school",
      "education_sned",
      [
        "Avg efectiveness",
        "Avg overcoming",
        "Avg initiative",
        "Avg integration",
        "Avg improvement",
        "Avg fairness",
        "Avg sned_score"
      ],
      {
        drillDowns: [
          ["Institutions", "Institution", "Institution"],
          ["Cluster", "Cluster", "Stage 2"]
        ],
        cuts: [`[Date].[Date].[Year].&[${sources.sned.year}]`],
        options: { parents: true }
      }
    )
  ];

  constructor(props) {
    super(props);
    this.state = {
      chartVariations: [],
      className: "blue",
      dialogHeader: "",
      dialogBody: [],
      isOpen: false,
      key: Math.random(),
      selectedObj: { value: "Avg efectiveness", subtitle: "Efectiveness" },
      selectedOption: "Avg efectiveness"
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  componentDidMount() {
    const { t } = this.props;
    const selector = [
      "Avg sned_score",
      "Avg efectiveness",
      "Avg overcoming",
      "Avg initiative",
      "Avg integration",
      "Avg improvement",
      "Avg fairness"
    ];

    const variations = selector.map((item, key) => {
      let subtitle = t(this.capitalizeFirstLetter(item.split(" ")[1]));
      let ms = subtitle;
      return { id: item, title: ms, value: item, subtitle };
    });

    this.setState({
      selectedOption: "Avg efectiveness",
      selectedObj: variations[1],
      chartVariations: variations,
      isOpen: false
    });
  }

  componentWillReceiveProps() {
    this.setState({
      isOpen: false
    });
  }

  handleChange(ev) {
    this.setState({ key: Math.random() });

    const obj = this.state.chartVariations.find(
      item => item.id === ev.newValue
    );
    this.setState({
      isOpen: false,
      selectedOption: obj.value,
      selectedObj: obj
    });
  }

  toggleDialog(header, body, className) {
    this.setState({
      isOpen: true,
      dialogHeader: header,
      dialogBody: body,
      className
    });
  }

  render() {
    const { t, className, i18n } = this.props;
    const locale = i18n.language;
    const { geo, path_sned_compare_by_school } = this.context.data;

    const measures = [
      "Avg efectiveness",
      "Avg overcoming",
      "Avg initiative",
      "Avg integration",
      "Avg improvement",
      "Avg fairness",
      "Avg sned_score"
    ];

    const path =
      geo.type == "comuna"
        ? `/api/data?measures=${measures.join(
            ","
          )}&drilldowns=Stage 1a,Institution,Year&Year=2016&Comuna=${geo.key}&parents=true&captions=${locale}`
        : geo.type == "region"
        ? `/api/data?measures=${measures.join(
            ","
          )}&drilldowns=Stage 1a,Institution,Year&Year=2016&Region=${geo.key}&parents=true&captions=${locale}`
        : `/api/data?measures=${measures.join(
            ","
          )}&drilldowns=Stage 1a,Comuna,Year&Year=2016&parents=true&captions=${locale}`;

    // const path = path_sned_compare_by_school;

    const title = geo.depth === 0 
      ? t("Average Performance By Comuna") 
      : t("Average Performance By School Type");
    const classSvg = "sned-performance-by-school-type";

    let customTick = "";

    return (
      <div className={className}>
        <CustomDialog
          icon="inbox"
          dialogHeader={this.state.dialogHeader}
          dialogBody={this.state.dialogBody}
          isOpen={this.state.isOpen}
          className={this.state.className}
        />
        <h3 className="chart-title">
          <span>
            {title}
            <SourceTooltip cube="sned" />
          </span>
          <ExportLink path={path} className={classSvg} title={title} />
        </h3>
        <BarChart
          className={classSvg}
          key={"sned" + this.state.selectedOption}
          config={{
            height: 400,
            data: path,
            groupBy: ["ID Stage 1a"],
            shapeConfig: {
              fill: d => snedColorScale("sned" + d["ID Stage 1a"]),
              label: false
            },
            aggs: {
              [this.state.selectedOption]: mean
            },
            stacked: true,
            y: "count",
            x: "interval",
            discrete: "x",
            yDomain: [0],
            xConfig: {
              barConfig: {"stroke-width": 1},
              gridConfig: {stroke: false},
              labelOffset: false,
              shapeConfig: {
                labelConfig: {
                  ellipsis: tick => {
                    let number = parseInt(tick.match(/\d/g).join(""));
                    let newTick = number + "–" + (number + 2);
                    return tick, newTick;
                  }
                }
              },
              title:
                t("Score Range") +
                " " +
                t(this.state.selectedObj.subtitle) +
                " (SIMCE)"
            },
            yConfig: {
              title: t("Number of schools"),
              tickFormat: tick => {
                let newTick = numeral(Math.ceil(tick), locale).format("0");
                if (newTick !== customTick) {
                  customTick = newTick;
                  return newTick;
                } else {
                  return " ";
                }
              }
            },
            xSort: (a, b) =>
              b[this.state.selectedOption] > a[this.state.selectedOption]
                ? -1
                : 1,
            on: {
              click: d => {
                let body = d.tooltip,
                  header =
                    t(this.state.selectedObj.subtitle) +
                    " (SIMCE) " +
                    (!(d["interval"] instanceof Array) ? d["interval"] : ""),
                  customclassName = "sned-" + d["ID Stage 1a"];
                this.toggleDialog(header, body, customclassName);
              }
            },
            tooltipConfig: {
              title: d =>
                `<h4 class="tooltip-title">
                  ${t(this.state.selectedObj.subtitle)}
                  (${d["Stage 1a"]})
                </h4>
                <h5 class="tooltip-subhead">${d["interval"]}</h5>`,
              body: d => {
                let body = `<h5>${d["Institution"] ? t("Schools") : t("Comunas")}</h5><ul class="tooltip-list u-list-reset">`;
                (d["Institution"] || d["Comuna"]) instanceof Array
                  ? (d["Institution"] || d["Comuna"]).forEach(item => {
                      body += `<li style='text-transform: capitalize;'>${item.toLowerCase()}</li>`;
                    })
                  : (body += `<li>${(d["Institution"] || d["Comuna"])}</li>`);
                return (
                  "<div style='overflow: hidden; max-height: 200px'>" +
                  body +
                  "</ul></div>"
                );
              },
              bodyStyle: {
                "max-height": "235px",
                overflow: "hidden"
              },
              footer: () => `<div class='tooltip-button btn'>${t("See more")}</div>`
            },
            legendTooltip: {
              title: d => d["Stage 1a"],
              body: d => "<div />"
            },
            legendConfig: {
              label: d => d["Stage 1a"],
              // shapeConfig: {
              //   backgroundImage: "/images/legend/education/type.png"
              // }
            }
          }}
          dataFormat={data => {
            const divisor = 50;
            const interval = 100 / divisor;

            let i = 0;
            let iteration = 0;

            const buckets = new Array(divisor).fill({}).map(item => {
              i += interval;
              iteration += 1;
              return {
                min: i - interval,
                max: iteration === divisor ? 100 : i,
                name:
                  Math.round(i - interval) + "–" + Math.round(i)
              };
            });

            return data.data.reduce((all, item) => {
              if (item[this.state.selectedOption]) {
                all.push({
                  ...item,
                  count: 1,
                  tooltip: {
                    [Math.random().toString()]: {
                      efectiveness:
                        Math.round(item["Avg efectiveness"] * 100) / 100,
                      fairness: Math.round(item["Avg fairness"] * 100) / 100,
                      improvement:
                        Math.round(item["Avg improvement"] * 100) / 100,
                      initiative:
                        Math.round(item["Avg initiative"] * 100) / 100,
                      integration:
                        Math.round(item["Avg integration"] * 100) / 100,
                      school: item["Institution"] || item["Comuna"],
                      overcoming:
                        Math.round(item["Avg overcoming"] * 100) / 100,
                      sned_score: Math.round(item["Avg sned_score"] * 100) / 100
                    }
                  },
                  interval: buckets.find(
                    i =>
                      i.min <= item[this.state.selectedOption] &&
                      item[this.state.selectedOption] <= i.max
                  )
                    ? buckets.find(
                        i =>
                          i.min <= item[this.state.selectedOption] &&
                          item[this.state.selectedOption] <= i.max
                      ).name
                    : ""
                });
              }

              return all;
            }, []);
          }}
        />

        <div className="option-group">
          {/* button group; shown on large screens */}
          <div className="btn-group u-hide-below-xs" aria-hidden="true">
            {this.state.chartVariations.map((button, i) => (
              <button
                key={`button_sned_${i}`}
                className={`btn font-xxs ${this.state.selectedOption === button.id ? "is-active" : "is-inactive"}`}
                onClick={() => this.setState({ selectedOption: button.id })}>
                {button.title}
              </button>
            ))}
          </div>

          {/* select menu; shown on small screens */}
          <div className="sned-select-container u-hide-above-xs">
            <Select
              id="variations"
              options={this.state.chartVariations}
              value={this.state.selectedOption}
              labelField="title"
              valueField="id"
              onChange={this.handleChange}
            />
        </div>
        </div>
      </div>
    );
  }
}

export default translate()(SNEDCompareBySchool);
