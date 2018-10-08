import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, {
  geoCut,
  simpleGeoChartNeed
} from "helpers/MondrianClient";

import { COLORS_GENDER } from "helpers/colors";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class MortalityBarchart extends Section {
  static need = [
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
      )(params, store)
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
      path_infant_mortality_one_to_ten
    } = this.context.data;

    const locale = i18n.language;
    const classSvg = "infant-mortality-one-to-ten";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {selected === "infancy"
              ? t("Infant Mortality")
              : t("Childhood Mortality")}
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
        <BarChart
          className={classSvg}
          config={{
            height: 400,
            data:
              selected === "infancy"
                ? path_infant_mortality_under_one
                : path_infant_mortality_one_to_ten,
            groupBy: ["ID Age Range"],
            label: d => d["Age Range"],
            x: "ID Age Range",
            y:
              geo.depth === 0
                ? "Rate Country"
                : geo.depth === 1
                  ? "Rate Region"
                  : "Rate Comuna",
            time: "ID Year",
            shapeConfig: {
              // fill: d => COLORS_GENDER[d["ID Sex"]]
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                //backgroundImage: d =>
                //  "/images/legend/sex/" + d["ID Sex"] + ".png"
              }
            }
          }}
          dataFormat={data => {
            const processData = data.data.reduce((all, d) => {
              all.push(d);
              return all;
            }, []);
            return data.data;
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
