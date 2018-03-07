import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { simpleDatumNeed, simpleGeoChartNeed } from "helpers/MondrianClient";
import {
  numeral,
  slugifyItem,
  getNumberFromTotalString
} from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";
import { productsColorScale } from "helpers/colors";

import Select from "components/Select";
import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import { BarChart } from "d3plus-react";

class SNEDCompareByCluster extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_sned_compare",
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
          ["Date", "Date", "Year"],
          ["Cluster", "Cluster", "Stage 2"]
        ],
        options: { parents: true }
      }
    ),
    (params, store) => {
      let geo = params;
      if (geo.comuna === undefined) {
        geo.region = "chile";
        return simpleDatumNeed(
          "datum_sned_compare_with_parent",
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
              ["Date", "Date", "Year"],
              ["Cluster", "Cluster", "Stage 2"]
            ],
            options: { parents: true }
          },
          "geo",
          false
        )(geo, store);
      } else {
        geo.comuna = undefined;
        return simpleDatumNeed(
          "datum_sned_compare_with_parent",
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
              ["Date", "Date", "Year"],
              ["Cluster", "Cluster", "Stage 2"]
            ],
            options: { parents: true }
          },
          "geo",
          false
        )(geo, store);
      }
    }
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

  componentDidMount() {
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
      return { id: key, title: item, value: item };
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
    const { datum_sned_compare_with_parent } = this.context.data;
    const path = this.context.data.path_sned_compare;

    const title = t("Compare by Cluster");
    const classSvg = "compare-by-cluster";

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
          config={{
            height: 500,
            data: path,
            groupBy: ["geo"],
            label: d => d["geo"],
            shapeConfig: {
              fill: d => {
                return geo.type === "country"
                  ? "#86396B"
                  : d["geo"] == geo.ancestors[0].caption
                    ? "#7986CB"
                    : geo.type === "region"
                      ? productsColorScale(d["geo"])
                      : "#86396B";
              },
              label: false
            },
            //label: d => d["Election Type"] + " - " + d["Year"],
            //sum: d => d["Votes"],
            time: "ID Year",
            x: "Stage 2",
            xConfig: {
              title: false
            },
            yConfig: {
              title: this.state.selectedObj.value,
              tickFormat: tick => numeral(tick, locale).format("0.00")
            },
            xSort: (a, b) => (b["Stage 2"] > a["Stage 2"] ? -1 : -1),
            y: this.state.selectedObj.value,
            discrete: "x",

            tooltipConfig: {
              title: d => d["Stage 2"] + "<br />" + d["geo"],
              body: d =>
                "<div>" +
                t("SNED Score") +
                ": " +
                numeral(d["Avg sned_score"], locale).format("0.00") +
                " " +
                "</div>"
            },
            legendTooltip: {
              body: d => "<div></div>"
            },
            legendConfig: {
              shapeConfig: {
                width: 25,
                height: 25
              }
            }
          }}
          dataFormat={data => {
            const location = data.data.map(item => {
              return { ...item, geo: geo.caption };
            });
            const country =
              geo.type !== "country"
                ? datum_sned_compare_with_parent.data.map(item => {
                    return {
                      ...item,
                      geo: geo.depth === 2 ? geo.ancestors[0].caption : "Chile"
                    };
                  })
                : [];

            return location.concat(country);
          }}
        />
        <SourceNote cube="sned" />
      </div>
    );
  }
}

export default translate()(SNEDCompareByCluster);
