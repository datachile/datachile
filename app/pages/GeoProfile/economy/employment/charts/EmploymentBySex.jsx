import React, { Component } from "react";
import _ from "lodash";
import { Section } from "datawheel-canon";
import { LinePlot } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { melt, getGeoObject } from "helpers/dataUtils";
import { employmentColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import Select from "components/Select";
import ExportLink from "components/ExportLink";

class EmploymentBySex extends Section {
  static need = [
    simpleGeoChartNeed("path_employment_by_sex", "nene", ["Expansion factor"], {
      drillDowns: [
        [
          "Occupational Situation",
          "Occupational Situation",
          "Occupational Situation"
        ],
        ["Sex", "Sex", "Sex"],
        ["Quaterly Reporting"]
      ]
    })
  ];

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selectedOption: 0,
      selectedObj: {
        path: "",
        groupBy: [],
        label: d => "",
        sum: d => ""
      },
      chartVariations: []
    };
  }

  componentDidMount() {
    const { t } = this.props;

    var variations = [
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

  handleChange(ev) {
    this.setState({
      selectedOption: ev.newValue,
      selectedObj: this.state.chartVariations[ev.newValue]
    });
  }

  render() {
    const { t, className, i18n } = this.props;
    const { selectedObj } = this.state;

    const locale = i18n.locale;

    const path = this.context.data.path_employment_by_sex;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Employment By Sex and Situation")}</span>
          <ExportLink path={path} />
          <Select
            id="variations"
            options={this.state.chartVariations}
            value={this.state.selectedOption}
            labelField="title"
            valueField="id"
            onChange={this.handleChange}
          />
        </h3>
        <LinePlot
          config={{
            height: 500,
            data: path,
            groupBy: "variable",
            x: "Month",
            y: "value",
            time: "Month",
            timeline: false,
            scale: "time",
            xConfig: {
              title: false
            },
            yConfig: {
              title: t("People"),
              tickFormat: tick => numeral(tick, locale).format("(0 a)")
            },
            shapeConfig: {
              Line: {
                stroke: d => employmentColorScale(d["variable"]),
                strokeWidth: 2
              }
            },
            tooltipConfig: {
              title: d => d["Month"],
              body: d =>
                numeral(d["value"], locale).format("(0 a)") + " " + t("people")
            }
          }}
          dataFormat={function(data) {
            var filtered = data.data.filter(function(d) {
              return d["ID Sex"] == selectedObj.sex_id;
            });
            var melted = [];
            filtered.forEach(function(f) {
              var a = {};
              var month = f["Month"].split("/");
              month =
                month[0] +
                "-" +
                (parseInt(month[1]) < 10 ? "0" + month[1] : month[1]) +
                "-01";
              a["Month"] = month;
              a["variable"] = f["Occupational Situation"];
              a["value"] = f["Expansion factor"];
              melted.push(a);
            });
            melted = melted.sort(function(a, b) {
              return a["Month"] > b["Month"] ? 1 : -1;
            });
            return melted;
          }}
        />
      </div>
    );
  }
}

export default translate()(EmploymentBySex);
