import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";

import { colorContrast } from "d3plus-color";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";
import { snedColorScale } from "helpers/colors";
import { sources } from "helpers/consts";

import { mean } from "d3-array";

import Select from "components/Select";
import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
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
      let subtitle: string = t(this.capitalizeFirstLetter(item.split(" ")[1]));
      let ms: string = t("Average") + " " + subtitle;
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
    const { path_sned_compare_by_school } = this.context.data;
    const path = path_sned_compare_by_school;

    const title = t("Performance By School Type");
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
          <span>{title}</span>
          <Select
            id="variations"
            options={this.state.chartVariations}
            value={this.state.selectedOption}
            labelField="title"
            valueField="id"
            onChange={this.handleChange}
          />
          <ExportLink path={path} className={classSvg} title={title} />
        </h3>
        <BarChart
          className={classSvg}
          key={"sned" + this.state.selectedOption}
          config={{
            height: 500,
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
              labelOffset: false,
              shapeConfig: {
                labelConfig: {
                  ellipsis: tick => {
                    let number = parseInt(tick.match(/\d/g).join(""));
                    let newTick = "[" + number + ", " + (number + 2) + "[";
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
                    " (SIMCE)" +
                    (!(d["interval"] instanceof Array) ? d["interval"] : ""),
                  customclassName = "sned-" + d["ID Stage 1a"];
                this.toggleDialog(header, body, customclassName);
              }
            },
            tooltipConfig: {
              arrow: " ",
              arrowStyle: {
                "background-color": "#F2F2F2"
              },
              width: "300px",
              background: d => snedColorScale("sned" + d["ID Stage 1a"]),
              title: d =>
                "<div>" +
                "<div>" +
                t(this.state.selectedObj.subtitle) +
                " (SIMCE) </div>" +
                "<div>" +
                d["interval"] +
                "</div>" +
                "</div>",
              padding: 0,
              titleStyle: {
                "background-color": d =>
                  snedColorScale("sned" + d["ID Stage 1a"]),
                color: d =>
                  colorContrast(snedColorScale("sned" + d["ID Stage 1a"])),
                padding: "10px"
              },
              body: d => {
                let body =
                  "<div style='background-color: #f2f2f2; padding: 5px 10px'>" +
                  t("Schools").toUpperCase() +
                  "</div>";
                d["Institution"] instanceof Array
                  ? d["Institution"].forEach(item => {
                      body +=
                        "<div style='padding: 5px 10px'>" + item + "</div>";
                    })
                  : (body +=
                      "<div style='padding: 5px 10px'>" +
                      d["Institution"] +
                      "</div>");
                return (
                  "<div style='overflow: hidden; max-height: 200px'>" +
                  body +
                  "</div>" +
                  (d["Institution"].length > 7
                    ? "<div style='padding: 5px 10px'>...</div>"
                    : "<div />")
                );
              },
              bodyStyle: {
                "max-height": "235px",
                overflow: "hidden",
                //"text-overflow": "ellipsis",
                "background-color": "#fff",
                color: "#333"
              },
              footer: d =>
                "<img style='margin: 0px 0px 0px 7px; height:18px' src='/images/icons/icon-ver-mas.svg' />" +
                t("For more details, click here"),

              footerStyle: {
                "background-color": "#F2F2F2",
                padding: "10px",
                color: "#555",
                "text-align": "right",
                display: "flex",
                "flex-direction": "row",
                "justify-items": "center",
                "margin-left": "auto",
                "flex-flow": "row-reverse"
              }
            },
            legendTooltip: {
              title: d => d["Stage 1a"],
              body: d => "<div />"
            },
            legendConfig: {
              label: d => d["Stage 1a"],
              shapeConfig: {
                width: 25,
                height: 25,
                backgroundImage: "/images/legend/education/type.png"
              }
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
                  "[" + Math.round(i - interval) + ", " + Math.round(i) + "["
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
                      school: item["Institution"],
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
        <SourceNote cube="sned" />
        <p
          className="chart-text"
          dangerouslySetInnerHTML={{
            __html: t("geo_profile.education.sned.disclaimer")
          }}
        />
        <p
          className="chart-text"
          dangerouslySetInnerHTML={{
            __html:
              t("geo_profile.education.sned.definitions.efectiveness.title") +
              ": " +
              t("geo_profile.education.sned.definitions.efectiveness.desc")
          }}
        />
        <p
          className="chart-text"
          dangerouslySetInnerHTML={{
            __html:
              t("geo_profile.education.sned.definitions.overcoming.title") +
              ": " +
              t("geo_profile.education.sned.definitions.overcoming.desc")
          }}
        />
        <p
          className="chart-text"
          dangerouslySetInnerHTML={{
            __html:
              t("geo_profile.education.sned.definitions.fairness.title") +
              ": " +
              t("geo_profile.education.sned.definitions.fairness.desc")
          }}
        />
        <p
          className="chart-text"
          dangerouslySetInnerHTML={{
            __html:
              t("geo_profile.education.sned.definitions.improvement.title") +
              ": " +
              t("geo_profile.education.sned.definitions.improvement.desc")
          }}
        />
        <p
          className="chart-text"
          dangerouslySetInnerHTML={{
            __html:
              t("geo_profile.education.sned.definitions.initiative.title") +
              ": " +
              t("geo_profile.education.sned.definitions.initiative.desc")
          }}
        />
        <p
          className="chart-text"
          dangerouslySetInnerHTML={{
            __html:
              t("geo_profile.education.sned.definitions.integration.title") +
              ": " +
              t("geo_profile.education.sned.definitions.integration.desc")
          }}
        />
        <SourceNote cube="sned_website" />
      </div>
    );
  }
}

export default translate()(SNEDCompareBySchool);
