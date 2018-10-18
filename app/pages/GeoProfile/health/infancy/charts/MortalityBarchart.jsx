import React from "react";
import { Section } from "@datawheel/canon-core";
import { BarChart, LinePlot } from "d3plus-react";
import { translate } from "react-i18next";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import Select from "components/Select";
import mondrianClient, {
  geoCut,
  simpleGeoChartNeed,
  simpleDatumNeed
} from "helpers/MondrianClient";

import { COLORS_GENDER } from "helpers/colors";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class MortalityBarchart extends Section {
  static need = [
    (params, store) =>
      simpleGeoChartNeed(
        "path_infant_mortality_under_one",
        "mortality_under_one",
        ["Number of deaths", "Rate Comuna", "Rate Region", "Rate Country"],
        {
          drillDowns: [
            ["Age Range", "Age Range DEIS", "Age Range"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: true },
          cuts: []
        }
      )(params, store),
    (params, store) =>
      simpleGeoChartNeed(
        "path_infant_mortality_one_to_ten",
        "mortality_one_to_ten",
        ["Number of deaths", "Rate Comuna", "Rate Region", "Rate Country"],
        {
          drillDowns: [
            ["Age Range", "Age Range DEIS", "Age Range"],
            ["Date", "Date", "Year"],
            ["Sex", "Sex", "Sex"]
          ],
          options: { parents: true },
          cuts: []
        }
      )(params, store),
    (params, store) => {
      let mirror = { ...params };
      mirror.comuna = undefined;

      return simpleDatumNeed(
        "path_infant_mortality_one_to_ten_data_plot",
        "mortality_one_to_ten",
        ["Number of deaths", "Rate Comuna", "Rate Region", "Rate Country"],
        {
          drillDowns: [
            ["Age Range", "Age Range DEIS", "Age Range"],
            ["Date", "Date", "Year"],
            ["Geography", "Geography", "Comuna"],
            ["Sex", "Sex", "Sex"]
          ],
          options: { parents: true },
          cuts: []
        },
        "geo",
        false
      )(mirror, store);
    },
    (params, store) => {
      let mirror = { ...params };
      mirror.comuna = undefined;

      return simpleDatumNeed(
        "path_infant_mortality_under_one_data_plot",
        "mortality_under_one",
        ["Number of deaths", "Rate Comuna", "Rate Region", "Rate Country"],
        {
          drillDowns: [
            ["Age Range", "Age Range DEIS", "Age Range"],
            ["Date", "Date", "Year"],
            ["Geography", "Geography", "Comuna"]
          ],
          options: { parents: true },
          cuts: []
        },
        "geo",
        false
      )(mirror, store);
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      chartVariations: [],
      selected: "infancy",
      selectedOption: 1
    };

    this.handleChange = this.handleChange.bind(this);
    this.toggleChart = this.toggleChart.bind(this);
  }

  componentDidMount() {
    const { t } = this.props;

    const {
      path_infant_mortality_one_to_ten_data_plot,
      path_infant_mortality_under_one_data_plot
    } = this.context.data;

    const membersIdTemp = [];

    const filteredData =
      this.state.selected === "infancy"
        ? path_infant_mortality_under_one_data_plot
        : path_infant_mortality_one_to_ten_data_plot;

    const childhoodIDs = [5, 6];

    const members = path_infant_mortality_under_one_data_plot.data
      .concat(path_infant_mortality_one_to_ten_data_plot.data)
      .reduce((all, d) => {
        if (membersIdTemp.indexOf(d["ID Age Range"]) === -1) {
          all.push({
            id: d["ID Age Range"],
            title: d["Age Range"],
            __type:
              childhoodIDs.indexOf(d["ID Age Range"]) === -1
                ? "infancy"
                : "childhood"
          });
          membersIdTemp.push(d["ID Age Range"]);
        }
        return all;
      }, []);

    this.setState({
      selectedOption: 1,
      chartVariations: members
    });
  }

  handleChange(ev) {
    const newValue = parseInt(ev.newValue);
    this.setState({
      selectedOption: newValue,
      selectedObj: this.state.chartVariations[newValue]
    });
  }

  toggleChart(chart) {
    this.setState({
      selectedOption: chart === "infancy" ? 1 : 5,
      selected: chart
    });
  }

  render() {
    const { selected } = this.state;
    const { t, className, i18n } = this.props;
    const {
      geo,
      path_infant_mortality_under_one,
      path_infant_mortality_one_to_ten,
      path_infant_mortality_one_to_ten_data_plot,
      path_infant_mortality_under_one_data_plot
    } = this.context.data;

    const locale = i18n.language;
    const classSvg = "infant-mortality-one-to-ten";

    let availableYears = [];
    const filteredData =
      selected === "infancy"
        ? path_infant_mortality_under_one_data_plot
        : path_infant_mortality_one_to_ten_data_plot;

    let data = filteredData.data
      .filter(item => item["ID Age Range"] === this.state.selectedOption)
      .reduce((all, d, i) => {
        all.push({
          ...d,
          Rate: d["Rate Comuna"],
          Geo: "Comuna",
          "ID Geography": `comuna_${d["ID Comuna"]}`,
          Geography: d["Comuna"]
        });
        if (availableYears.indexOf(d["ID Year"]) === -1) {
          all.push({
            ...d,
            Rate: d["Rate Region"],
            Geo: "Region",
            "ID Geography": `region_${d["ID Region"]}`,
            Geography: d["Region"]
          });
          all.push({
            ...d,
            Rate: d["Rate Country"],
            Geo: "Country",
            "ID Geography": `country_${d["ID Country"]}`,
            Geography: "Chile"
          });
          availableYears.push(d["ID Year"]);
        }
        // all.push({ ...d, Rate: d["Rate Region"], Geo: "Region" });
        return all;
      }, []);

    if (geo.type === "country") {
      availableYears = [];
      let availableRegions = [];
      data = filteredData.data.reduce((all, d) => {
        if (
          availableRegions.indexOf(`${d["ID Region"]}_${d["ID Year"]}`) === -1
        ) {
          availableRegions.push(`${d["ID Region"]}_${d["ID Year"]}`);
          all.push({
            Region: d["Region"],
            "ID Year": d["ID Year"],
            Rate: d["Rate Region"],
            Geo: "Region",
            "ID Geography": `region_${d["ID Region"]}`,
            Geography: d["Region"]
          });
        }

        if (availableYears.indexOf(d["ID Year"]) === -1) {
          all.push({
            ...d,
            Rate: d["Rate Country"],
            Geo: "Country",
            "ID Geography": `country_${d["ID Country"]}`,
            Geography: "Chile"
          });
          availableYears.push(d["ID Year"]);
        }

        return all;
      }, []);
    }

    /**selected === "infancy"
                ? path_infant_mortality_under_one
                : path_infant_mortality_one_to_ten, */

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {selected === "infancy"
              ? t("Infant Mortality Rate")
              : t("Childhood Mortality Rate")}
            <SourceTooltip cube="mortality_under_one" />
          </span>
          <ExportLink
            path={
              selected === "infancy"
                ? path_infant_mortality_under_one
                : path_infant_mortality_one_to_ten
            }
            className={classSvg}
          />
        </h3>
        <LinePlot
          className={classSvg}
          config={{
            height: 400,
            data,
            groupBy: ["ID Geography"],
            label: d => d["Geography"],
            x: "ID Year",
            y: "Rate",
            shapeConfig: {
              Line: {
                strokeLinecap: "round",
                strokeWidth: d =>
                  `comuna_${geo.key}` === d["ID Geography"] ||
                  d["Geo"] === "Country" ||
                  d["Geo"] === "Region"
                    ? 5
                    : 1,
                stroke: d =>
                  d["Geo"] === "Country"
                    ? "#EE293E"
                    : d["Geo"] === "Region"
                      ? "#11A29B"
                      : `comuna_${geo.key}` === d["ID Geography"]
                        ? "#335CB5"
                        : "gray"
              }
            },
            tooltipConfig: {
              title: d => d["Geography"],
              body: d =>
                "<div>" +
                (selected === "infancy"
                  ? t("Infant Mortality Rate")
                  : t("Childhood Mortality Rate")) +
                " " +
                numeral(d["Rate"], locale).format("0.00") +
                "<div>" +
                d["ID Year"] +
                "</div>" +
                "</div>"
            },
            legendConfig: {
              label: false
            },
            legendTooltip: {
              title: d =>
                d["Geography"] instanceof Array
                  ? geo.type === "country"
                    ? t("Regions")
                    : t("Other Comunas")
                  : d["Geography"],
              body: "<div></div>"
            }
          }}
        />
        <div className="viz-controls">
          <Select
            id="variations"
            options={this.state.chartVariations.filter(
              d => d.__type === this.state.selected
            )}
            value={this.state.selectedOption}
            labelField="title"
            valueField="id"
            onChange={this.handleChange}
          />
          <div className="btn-group">
            <button
              className={`btn font-xxs ${
                selected === "infancy" ? "is-active" : "is-inactive"
              }`}
              onClick={() => this.toggleChart("infancy")}
            >
              <span className="btn-text">{t("Infancy")}</span>
            </button>
            <button
              className={`btn font-xxs ${
                selected === "childhood" ? "is-active" : "is-inactive"
              }`}
              onClick={() => this.toggleChart("childhood")}
            >
              <span className="btn-text">{t("Childhood")}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default translate()(MortalityBarchart);
