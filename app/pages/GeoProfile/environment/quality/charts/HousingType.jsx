import React from "react";
import _ from "lodash";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceNote from "components/SourceNote";

class HousingType extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const prm = mondrianClient.cube("casen_household").then(cube => {
        var q = geoCut(
          geo,
          "Geography",
          cube.query
            .option("parents", true)
            .drilldown("Household Type", "Household Type", "Household Type")
            .drilldown("Date", "Date", "Year")
            .measure(
              geo.type == "comuna"
                ? "Expansion Factor Comuna"
                : "Expansion Factor Region"
            ),
          store.i18n.locale
        );

        return {
          key: "path_housing_type",
          data: store.env.CANON_API + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
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
        <h3 className="chart-title">{t("Housing Type")}</h3>
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
              return a["Number of visas"] > b["Number of visas"] ? 1 : -1;
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
