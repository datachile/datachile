import React from "react";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";
import { Switch } from "@blueprintjs/core";

import { numeral, moneyRangeFormat } from "helpers/formatters";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { COLORS_GENDER } from "helpers/colors";
import { getGeoObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import NoDataAvailable from "components/NoDataAvailable";

class IncomeBySex extends Section {
  state = {
    show: true,
    stacked: true
  };

  static need = [
    (params, store) => {
      let geo = getGeoObject(params);
      //force to region query on comuna profile
      if (geo.type === "comuna") {
        geo = geo.ancestor;
      }
      return simpleGeoChartNeed(
        "path_income_by_sex",
        "nesi_income",
        ["Expansion Factor"],
        {
          drillDowns: [
            ["Date", "Date", "Year"],
            ["Income Range", "Income Range", "Income Range"],
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
		const path = this.context.data.path_income_by_sex;

    const locale = i18n.language;
    const classSvg = "income-by-sex";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Income By Sex")}
            <SourceTooltip cube="nesi_income" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        {this.state.show ? (
          <BarChart
            className={classSvg}
            config={{
              height: 400,
              data: path,
              groupBy: "ID Sex",
              label: d => d["Sex"],
              time: "ID Year",
              x: "Income Range",
              y: "Expansion Factor",
              stacked: stacked,
              shapeConfig: {
                fill: d => COLORS_GENDER[d["ID Sex"]],
                label: false
              },
              xConfig: {
                tickSize: 0,
                title: t("Income Range CLP"),
                tickFormat: tick => moneyRangeFormat(tick, locale)
              },
              xSort: (a, b) =>
                a["ID Income Range"] > b["ID Income Range"] ? 1 : -1,
              yConfig: {
                title: t("People"),
                tickFormat: tick => numeral(tick, locale).format("(0.[0]a)")
              },
              barPadding: 0,
              groupPadding: 5,
              tooltipConfig: {
                title: d => {
                  var title = d["Sex"];
                  title +=
                    d["Income Range"] instanceof Array
                      ? ""
                      : ": " + moneyRangeFormat(d["Income Range"], locale);
                  return title;
                },
                body: d =>
                  numeral(d["Expansion Factor"], locale).format("(0.[0]a)") +
                  " " +
                  t("people")
              },
              legendConfig: {
                label: false,
                shapeConfig: {
                  backgroundImage: d =>
                    "/images/legend/sex/" + d["ID Sex"] + ".png"
                }
              }
            }}
            dataFormat={data => {
              if (data.data && data.data.length > 0) {
                return data.data;
              } else {
                this.setState({ show: false });
              }
            }}
          />
        ) : (
          <NoDataAvailable />
        )}
        {/* stacked bar toggle */}
        <Switch
          onClick={this.toggleStacked.bind(this)}
          label={t("Stacked bars")}
          defaultChecked={stacked}
        />
      </div>
    );
  }
}

export default translate()(IncomeBySex);
