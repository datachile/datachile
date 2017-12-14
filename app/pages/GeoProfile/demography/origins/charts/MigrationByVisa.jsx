import React from "react";
import { Section } from "datawheel-canon";
import map from "lodash/map";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import filter from "lodash/filter";
import reduce from "lodash/reduce";
import clone from "lodash/clone";
import flatMap from "lodash/flatMap";

import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import { continentColorScale } from "helpers/colors";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

class MigrationByVisa extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_migration_by_visa_type",
      "immigration",
      ["Number of visas"],
      {
        drillDowns: [
          ["Origin Country", "Country", "Country"],
          ["Visa Type", "Visa Type", "Visa Type"],
          ["Date", "Date", "Year"]
        ],
        options: { parents: true }
      }
    )
  ];

  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.path_migration_by_visa_type;

    const locale = i18n.locale;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Migration By Visa Type")}</span>
        </h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Continent"],
            label: d => d["Continent"],
            time: "ID Year",
            stacked: true,
            y: "Number of visas",
            x: "Visa Type",
            shapeConfig: {
              fill: d => continentColorScale("c" + d["ID Continent"]),
              label: false,
              height: 20
            },
            xConfig: {
              tickSize: 0,
              title: false
            },
            yConfig: {
              barConfig: { "stroke-width": 0 },
              tickSize: 0,
              title: t("Number of visas")
            },
            ySort: (a, b) => {
              return a["Number of visas"] > b["Number of visas"] ? 1 : -1;
            },
            barPadding: 0,
            groupPadding: 5,
            tooltipConfig: {
              title: d => d["Continent"],
              body: d =>
                numeral(d["Number of visas"], locale).format("( 0,0 )") +
                " " +
                t("visas")
            },
            legendConfig: {
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d =>
                  "/images/legend/continent/" + d["ID Continent"] + ".png"
              }
            }
          }}
          //dataFormat={data => data.data}
          dataFormat={function(data) {
            var limit = 0;
            var resp = [];
            if (data.data.length > 0) {
              var grouped = map(groupBy(data.data, "ID Year"), function(
                children,
                year
              ) {
                children = orderBy(
                  filter(
                    children,
                    o =>
                      o["Number of visas"] != null && o["Number of visas"] != 0
                  ),
                  ["Number of visas"],
                  ["desc"]
                );
                if (children.length > 20) {
                  limit = children[19]["Number of visas"];
                  var othersCount = reduce(
                    filter(children, o => o["Number of visas"] <= limit),
                    (sum, r) => sum + r["Number of visas"],
                    0
                  );
                  var others = clone(children[0]);
                  others["Number of visas"] = othersCount;
                  others["Country"] = t("Others");
                  children = filter(
                    children,
                    o => o["Number of visas"] > limit
                  );
                  children.push(others);
                }
                return children;
              });

              resp = flatMap(grouped, m => m);
            }

            return resp;
          }}
        />
      </div>
    );
  }
}

export default translate()(MigrationByVisa);
