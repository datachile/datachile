import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";

import { simpleDatumNeed, simpleGeoChartNeed } from "helpers/MondrianClient";
import {
  numeral,
  slugifyItem,
  getNumberFromTotalString
} from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";
import { snedColorScale, snedComparisonColorScale } from "helpers/colors";
import { sources } from "helpers/consts";

import { mean } from "d3-array";

import Select from "components/Select";
import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import { BarChart } from "d3plus-react";

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
      selectedOption: 0,
      key: Math.random(),
      selectedObj: { value: "Avg sned_score" },
      chartVariations: []
    };
    this.handleChange = this.handleChange.bind(this);
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
      let ms =
        t("Average") + " " + t(this.capitalizeFirstLetter(item.split(" ")[1]));
      return { id: key, title: ms, value: item };
    });

    this.setState({
      selectedOption: 0,
      selectedObj: variations[0],
      chartVariations: variations
    });
  }

  handleChange(ev) {
    this.setState({ key: Math.random() });

    this.setState({
      selectedOption: ev.newValue,
      selectedObj: this.state.chartVariations[ev.newValue]
    });
  }

  render() {
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;
    const locale = i18n.language;
    const { path_sned_compare_by_school } = this.context.data;
    const path = this.context.data.path_sned_compare_by_school;

    const title = t("Comparison by Cluster");
    const classSvg = "sned-compare-by-cluster";

    return (
      <div className={className}>
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
          config={{
            height: 500,
            data: path,
            aggs: {
              "Avg efectiveness": mean
            },
            //groupBy: ["geo"],
            shapeConfig: {
              fill: d => snedColorScale("sned" + 1),
              label: false
            },
            //label: d => d["Election Type"] + " - " + d["Year"],
            //sum: d => d["Votes"],
            y: "count",
            x: "interval",
            discrete: "x",
            xConfig: {
              title: t("Efectiveness") + " (SIMCE)"
            },
            yConfig: {
              title: t("Number of schools"),
              tickFormat: tick => numeral(tick, locale).format("0")
            },
            xSort: (a, b) =>
              b["Avg efectiveness"] > a["Avg efectiveness"] ? -1 : 1,

            tooltipConfig: {
              title: d => d["interval"],
              body: d => {
                let body = t("Schools") + ":";
                d["Institution"].forEach(item => {
                  body += item + "<br />";
                });
                return body;
              }
            },
            legendTooltip: {
              title: d => d["Stage 1a"] + "<br />" + d["geo"],
              body: d => "<div></div>"
            },
            legendConfig: {
              label: d => d["geo"] + " - " + d["Stage 1a"],
              shapeConfig: {
                width: 25,
                height: 25,
                backgroundImage: "/images/legend/education/type.png"
              }
            }
          }}
          dataFormat={data => {
            return data.data.reduce((all, item) => {
              if (item["Avg efectiveness"])
                all.push({
                  ...item,
                  count: 1,
                  interval: item["Avg efectiveness"]
                    ? item["Avg efectiveness"] - item["Avg efectiveness"] % 10
                    : null
                });
              return all;
            }, []);
          }}
        />
        <SourceNote cube="sned" />
      </div>
    );
  }
}

export default translate()(SNEDCompareBySchool);
