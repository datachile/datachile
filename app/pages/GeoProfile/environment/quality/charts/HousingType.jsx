import React from "react";
import _ from "lodash";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";

class HousingType extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      return simpleGeoChartNeed(
        "path_housing_type",
        "casen_household",
        [
          geo.type == "comuna"
            ? "Expansion Factor Comuna"
            : "Expansion Factor Region"
        ],
        {
          drillDowns: [
            ["Household Type", "Household Type", "Household Type"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: true }
        }
      )(params, store);
    }
  ];

  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.path_housing_type;
    if (!i18n.language) return null;
    const locale = i18n.language.split("-")[0];
    const geo = this.context.data.geo;
    const msrName =
      geo.type == "comuna"
        ? "Expansion Factor Comuna"
        : "Expansion Factor Region";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Housing Type")}</span>
          <ExportLink path={path} />
        </h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: "ID Household Type",
            label: d => d["Household Type"],
            time: "ID Year",
            x: msrName,
            y: "Household Type",
            shapeConfig: {
              fill: d => ordinalColorScale(2),
              label: false
            },
            discrete: "y",
            xConfig: {
              tickSize: 0,
              title: t("Number of houses"),
              tickFormat: tick => numeral(tick, locale).format("(0.0 a)")
            },
            yConfig: {
              barConfig: { "stroke-width": 0 },
              tickSize: 0,
              title: false
            },
            ySort: (a, b) => {
              return a[msrName] > b[msrName] ? 1 : -1;
            },
            barPadding: 0,
            groupPadding: 5,
            tooltipConfig: {
              title: d => d["Activity"],
              body: d =>
                `${numeral(d[msrName], locale).format("( 0,0 )")} ${t(
                  "houses"
                )}`
            },
            legendConfig: {
              label: false,
              shapeConfig: false
            }
          }}
          dataFormat={data => {
            return _.orderBy(data.data, [msrName], ["ASC"]);
          }}
        />
        <SourceNote cube="casen_household" />
      </div>
    );
  }
}

export default translate()(HousingType);
