import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { employmentBySexColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import Select from "components/Select";
import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import CustomStackedArea from "components/CustomStackedArea";

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
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selectedOption: 0,
      key: Math.random(),
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
    this.setState({ key: Math.random() });

    this.setState({
      selectedOption: ev.newValue,
      selectedObj: this.state.chartVariations[ev.newValue]
    });
  }

  render() {
    const { t, className, i18n } = this.props;
    const { chartVariations, key, selectedObj, selectedOption } = this.state;

    const locale = i18n.language;

    // path for data
    const path = this.context.data.path_employment_by_sex;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Regional Employment By Sex")}
            <SourceTooltip cube="nene" />
          </span>
          <ExportLink path={path} />
        </h3>
        <CustomStackedArea
          key={key}
          config={{
            height: 400,
            data: path,
            groupBy: ["variable"],
            label: d => d["variable"],
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
          Sex={selectedObj.sex_id}
        />

        <Select
          id="variations"
          options={chartVariations}
          value={selectedOption}
          labelField="title"
          valueField="id"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default translate()(EmploymentBySex);
