import React from "react";
import { Section } from "@datawheel/canon-core";
import { LinePlot } from "d3plus-react";
import { withNamespaces } from "react-i18next";

import { COLORS_GENDER } from "helpers/colors";
import { simpleGeoChartNeed } from "helpers/MondrianClient";

import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class PSUResultsBySex extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_higher_psu_by_sex",
      "psu",
      ["Number of records", "Avg language test", "Avg math test"],
      {
        drillDowns: [["Sex", "Sex", "Sex"], ["Date", "Date", "Year"]],
        options: { parents: true }
      }
    )
  ];

  state = {
    selected: "lang"
  };

  toggleChart(chart) {
    this.setState({
      selected: chart
    });
  }

  // to stack, or not to stack
  render() {
    const { t, className, i18n } = this.props;
    const { selected } = this.state;

    const locale = i18n.language;
    const classSvg = "psu-results-by-sex";

    const path = this.context.data.path_higher_psu_by_sex;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("PSU Results By Sex")}
            <SourceTooltip cube="psu" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        <LinePlot
          className={classSvg}
          forceUpdate={true}
          config={{
            height: 400,
            data: path,
            filter: d =>
              this.state.selected === "lang"
                ? d["ID Test"] === 1
                : d["ID Test"] === 2,
            groupBy: ["ID Test", "ID Sex"],
            label: d => t(d["Sex"]),
            x: "ID Year",
            y: "AVG Test",
            shapeConfig: {
              Line: {
                stroke: d => COLORS_GENDER[d["ID Sex"]],
                strokeLinecap: "round",
                strokeWidth: 5
              },
              label: d => d["Sex"]
            },
            xConfig: {
              title: false
            },
            yConfig: {
              title: "PSU"
            },
            groupPadding: 10,
            legendConfig: {
              label: false,
              shapeConfig: {
                backgroundImage: d =>
                  "/images/legend/sex/" + d["ID Sex"] + ".png"
              }
            },
            tooltipConfig: {
              body: d =>
                d.Test +
                ": " +
                numeral(d["AVG Test"], locale).format("0,0.[0]") +
                " " +
                t("Points")
            }
          }}
          dataFormat={data => {
            const reduced = data.data.reduce((all, d) => {
              all.push({
                ...d,
                "AVG Test": d["Avg language test"],
                Test: t("Language_PSU"),
                "ID Test": 1
              });

              all.push({
                ...d,
                "AVG Test": d["Avg math test"],
                Test: t("Math"),
                "ID Test": 2
              });
              return all;
            }, []);
            return reduced;
          }}
        />
        <div className="btn-group">
          <button
            className={`btn font-xxs ${
              selected === "math" ? "is-active" : "is-inactive"
            }`}
            onClick={() => this.toggleChart("math")}
          >
            <span className="btn-text">{t("Math")}</span>
          </button>
          <button
            className={`btn font-xxs ${
              selected === "lang" ? "is-active" : "is-inactive"
            }`}
            onClick={() => this.toggleChart("lang")}
          >
            <span className="btn-text">{t("Language_PSU")}</span>
          </button>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(PSUResultsBySex);
