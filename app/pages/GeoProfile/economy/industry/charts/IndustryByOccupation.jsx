import React, { Component } from "react";

import { Treemap } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import Select from "components/Select";

import ExportLink from "components/ExportLink";

class IndustryByOccupation extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_industry_occupation_common",
      "nesi_income",
      ["Expansion Factor"],
      {
        drillDowns: [["ISCO", "ISCO", "ISCO"], ["Date", "Date", "Year"]],
        options: { parents: true }
      }
    ),
    simpleGeoChartNeed(
      "path_industry_occupation_income",
      "nesi_income",
      ["Expansion Factor", "Median Income"],
      {
        drillDowns: [["ISCO", "ISCO", "ISCO"], ["Date", "Date", "Year"]],
        options: { parents: true }
      }
    ),
    simpleGeoChartNeed(
      "path_industry_occupation_specialized",
      "nesi_income",
      ["Expansion Factor", "Median Income"],
      {
        drillDowns: [
          ["ISCED", "ISCED", "ISCED"],
          ["ISCO", "ISCO", "ISCO"],
          ["Date", "Date", "Year"]
        ],
        options: { parents: true }
      }
    )
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
        title: t("Most common occupations"),
        path: this.context.data.path_industry_occupation_common,
        groupBy: ["ID ISCO"],
        label: d => d["ISCO"],
        sum: d => d["Expansion Factor"]
      },
      {
        id: 1,
        title: t("Best paid occupations"),
        path: this.context.data.path_industry_occupation_income,
        groupBy: ["ID ISCO"],
        label: d => d["ISCO"],
        sum: d => d["Median Income"]
      },
      {
        id: 2,
        title: t("Most Specialized occupations"),
        path: this.context.data.path_industry_occupation_specialized,
        groupBy: ["ID ISCO", "ID ISCED"],
        label: d => d["ISCO"] + " - " + d["ISCED"],
        sum: d => d["Expansion Factor"]
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
    const { t, className } = this.props;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <Select
            id="variations"
            options={this.state.chartVariations}
            value={this.state.selectedOption}
            labelField="title"
            valueField="id"
            onChange={this.handleChange}
          />
        </h3>

        <Treemap
          config={{
            height: 500,
            data: this.state.selectedObj.path,
            groupBy: this.state.selectedObj.groupBy,
            label: this.state.selectedObj.label,
            sum: this.state.selectedObj.sum,
            time: "ID Year",
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID ISCO"])
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 20,
                height: 20,
                backgroundImage: d => "/images/legend/occupation/occupation.png"
              }
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(IndustryByOccupation);
