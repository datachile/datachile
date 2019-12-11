import React from "react";
import { Section } from "@datawheel/canon-core";
import { BarChart } from "d3plus-react";
import { withNamespaces } from "react-i18next";
import { Switch } from "@blueprintjs/core";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { COLORS_GENDER } from "helpers/colors";
import { numeral } from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class SalariesByOccupation extends Section {
  state = {
    stacked: false
  };
  static need = [
    (params, store) => {
      let geo = getGeoObject(params);
      //force to region query on comuna profile
      if (geo.type === "comuna") {
        geo = geo.ancestor;
      }
      return simpleGeoChartNeed(
        "path_salaries_by_occupation",
        "nesi_income",
        ["Median Income"],
        {
          drillDowns: [
            ["ISCO", "ISCO", "ISCO"],
            ["Date", "Date", "Year"],
            ["Sex", "Sex", "Sex"]
          ],
          options: { parents: true }
        },
        geo
      )(params, store);
    }
  ];

  // to stack, or not to stack
  toggleStacked() {
    this.setState({
      stacked: !this.state.stacked
    });
  }

  render() {
    const { t, className, i18n } = this.props;
    const { stacked } = this.state;
    const path = this.context.data.path_salaries_by_occupation;

    const locale = i18n.language;
    const classSvg = "salaries-by-occupation";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Salaries By Occupation")}
            <SourceTooltip cube="nesi_income" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <BarChart
          className={classSvg}
          config={{
            height: 400,
            data: path,
            groupBy: ["ID Sex"],
            label: d => d["ISCO"],
            time: "ID Year",
            discrete: "y",
            y: "ISCO",
            x: "Median Income",
            stacked: stacked,
            shapeConfig: {
              fill: d => COLORS_GENDER[d["ID Sex"]],
              label: () => ""
            },
            yConfig: {
              labelRotation: false,
              tickSize: 0,
              title: false,
              maxSize: 120
            },
            ySort: (a, b) => a["Median Income"] - b["Median Income"],
            xConfig: {
              labelRotation: false,
              title: t("Median Income CLP"),
              tickFormat: tick => numeral(tick, locale).format("(0.[0]a)")
            },
            barPadding: 0,
            groupPadding: 10,
            legendConfig: {
              label: false,
              shapeConfig: {
                backgroundImage: d =>
                  "/images/legend/sex/" + d["ID Sex"] + ".png"
              }
            }
          }}
          dataFormat={data => data.data}
        />
        {/* stacked bar toggle */}
        {/*<Switch
          onClick={this.toggleStacked.bind(this)}
          label={t("Stacked bars")}
          defaultChecked={stacked}
        />*/}
      </div>
    );
  }
}

export default withNamespaces()(SalariesByOccupation);
