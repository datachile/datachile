import React from "react";
import { Section } from "@datawheel/canon-core";
import { BarChart, LinePlot } from "d3plus-react";
import { translate } from "react-i18next";

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

  state = {
    selected: "infancy"
  };

  toggleChart(chart) {
    this.setState({
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

    const availableYears = [];
    const filteredData =
      selected === "infancy"
        ? path_infant_mortality_under_one_data_plot
        : path_infant_mortality_one_to_ten_data_plot;

    let data = filteredData.data
      // .filter(item => item["ID Age Range"] === 5 && item["ID Sex"] === 1)
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
            "ID Geography": `region_${d["ID Comuna"]}`,
            Geography: d["Region"]
          });
          all.push({
            ...d,
            Rate: d["Rate Country"],
            Geo: "Country",
            "ID Geography": `country_${d["ID Comuna"]}`,
            Geography: "Chile"
          });
          availableYears.push(d["ID Year"]);
        }
        // all.push({ ...d, Rate: d["Rate Region"], Geo: "Region" });
        return all;
      }, []);

    console.log(data);
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
            <SourceTooltip cube="mortality_one_to_ten" />
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
            legendConfig: {
              label: false
            }
          }}
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
    );
  }
}

export default translate()(MortalityBarchart);
