import React from "react";
import { Section } from "@datawheel/canon-core";
import { translate } from "react-i18next";

import { simpleDatumNeed, simpleGeoChartNeed } from "helpers/MondrianClient";
import {
  numeral,
  slugifyItem,
  getNumberFromTotalString
} from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";
import { snedColorScale, snedComparisonColorScale } from "helpers/colors";

import Select from "components/Select";
import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
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
      if (params.comuna === undefined) {
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
          "geo_no_cut",
          false
        )(params, store);
      } else {
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
          "geo_by_region",
          false
        )(params, store);
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
    const measures = [
      "Avg efectiveness",
      "Avg overcoming",
      "Avg initiative",
      "Avg integration",
      "Avg improvement",
      "Avg fairness",
      "Avg sned_score"
    ];

    let path =
      geo.type == "comuna"
        ? `/api/data?measures=${measures.join(
            ","
          )}&drilldowns=Stage 2,Year&Comuna=${geo.key}&parents=true`
        : geo.type == "region"
        ? `/api/data?measures=${measures.join(
            ","
          )}&drilldowns=Stage 2,Year&Region=${geo.key}&parents=true`
        : `/api/data?measures=${measures.join(
            ","
          )}&drilldowns=Stage 2,Year&parents=true`;

    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;
    const locale = i18n.language;
    const { datum_sned_compare_with_parent } = this.context.data;
    // const path = this.context.data.path_sned_compare;

    const title = t("Comparison by Cluster");
    const classSvg = "sned-compare-by-cluster";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {title}
            <SourceTooltip cube="sned_website" />
          </span>
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
            height: 400,
            data: path,
            groupBy: ["geo"],
            label: d => d["geo"],
            shapeConfig: {
              fill: d =>
                geo.type === "country"
                  ? snedColorScale("sned" + d["ID Stage 1a"])
                  : geo.name === d["geo"]
                  ? snedColorScale("sned" + d["ID Stage 1a"])
                  : snedComparisonColorScale("sned" + d["ID Stage 1a"]),
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
              title: this.state.selectedObj.title,
              tickFormat: tick => numeral(tick, locale).format("0")
            },
            xSort: (a, b) => (b["ID Stage 1b"] > a["ID Stage 1b"] ? -1 : 1),
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
              title: d => d["Stage 1a"] + "<br />" + d["geo"],
              body: d => "<div></div>"
            },
            legendConfig: {
              label: d => d["geo"] + " - " + d["Stage 1a"],
              shapeConfig: {
                backgroundImage: "/images/legend/education/type.png"
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
        <SourceTooltip cube="sned" />
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
      </div>
    );
  }
}

export default translate()(SNEDCompareByCluster);
