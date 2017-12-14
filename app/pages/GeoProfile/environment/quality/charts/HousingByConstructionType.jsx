import React from "react";
import orderBy from "lodash/orderBy";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";

class HousingByConstructionType extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      return simpleGeoChartNeed(
        "path_housing_construction_type",
        "casen_household",
        [
          geo.type == "comuna"
            ? "Expansion Factor Comuna"
            : "Expansion Factor Region"
        ],
        {
          drillDowns: [
            ["Walls Material", "Walls Material", "Walls Material"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: true }
        }
      )(params, store);
    },
    (params, store) => {
      var geo = getGeoObject(params);
      //Skip comuna and calculate region path in case of comuna has no data
      if (geo.type == "comuna") {
        geo = geo.ancestor;
      }
      return simpleGeoChartNeed(
        "path_housing_construction_type_fallback",
        "casen_household",
        ["Expansion Factor Region"],
        {
          drillDowns: [
            ["Walls Material", "Walls Material", "Walls Material"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: true }
        },
        geo
      )(params, store);
    }
  ];

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      path: this.context.data.path_housing_construction_type
    });
  }

  render() {
    const { t, className, i18n } = this.props;

    const { path } = this.state;

    const { path_housing_construction_type_fallback } = this.context.data;

    const locale = i18n.locale;
    const geo = this.context.data.geo;

    var msrName = "Expansion Factor Comuna";

    if (
      geo.type != "comuna" ||
      path == path_housing_construction_type_fallback
    ) {
      msrName = "Expansion Factor Region";
    }

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Material of Walls")}</span>
          <ExportLink path={path} />
        </h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: "ID Walls Material",
            label: d => d["Walls Material"],
            time: "ID Year",
            x: msrName,
            y: "Walls Material",
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
              title: false,
              width: 200
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
            if (data.data.length > 0) {
              return orderBy(data.data, [msrName], ["ASC"]);
            } else {
              this.setState({ path: path_housing_construction_type_fallback });
              return [{}];
            }
          }}
        />
        <SourceNote cube="casen_household" />
      </div>
    );
  }
}

export default translate()(HousingByConstructionType);
