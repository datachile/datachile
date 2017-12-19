import React from "react";
import { translate } from "react-i18next";

import { BarChart } from "d3plus-react";
import { Section } from "datawheel-canon";
import clone from "lodash/clone";
import flatMap from "lodash/flatMap";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";

import { continentColorScale } from "helpers/colors";
import { getGeoObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";
import mondrianClient, { geoCut } from "helpers/MondrianClient";

import ExportLink from "components/ExportLink";
import MiniFilter from "components/MiniFilter";
import SourceNote from "components/SourceNote";

class MigrationByVisa extends Section {
  state = {
    filter_sex: 2147483647,
    filter_age: 2147483647
  };

  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const promise = mondrianClient
        .cube("immigration")
        .then(cube => {
          const q = cube.query
            .option("parents", true)
            .drilldown("Date", "Date", "Year")
            .drilldown("Sex", "Sex", "Sex")
            .drilldown(
              "Calculated Age Range",
              "Calculated Age Range",
              "Age Range"
            )
            .drilldown("Origin Country", "Country", "Country")
            .drilldown("Visa Type", "Visa Type", "Visa Type")
            .measure("Number of visas");

          return mondrianClient.query(
            geoCut(geo, "Geography", q, store.i18n.locale),
            "jsonrecords"
          );
        })
        .then(res => {
          return {
            key: "chart_migration_by_visa_type",
            data: {
              path: res.url.replace("aggregate", "aggregate.jsonrecords"),
              raw: res.data.data,
              age_ranges: Object.keys(groupBy(res.data.data, "Age Range")).sort(
                (a, b) => parseInt(a.split("-")[0]) - parseInt(b.split("-")[0])
              )
            }
          };
        });

      return { type: "GET_DATA", promise };
    }
  ];

  toggleFilter = (key, flag) => {
    this.setState(prevState => ({ [key]: prevState[key] ^ flag }));
  };

  render() {
    const { t, className, i18n } = this.props;
    const { filter_sex, filter_age } = this.state;
    const locale = i18n.locale;

    const chart_data = this.context.data.chart_migration_by_visa_type;

    const flags_ageranges = {};

    const filters = [
      {
        name: t("Gender"),
        key: "filter_sex",
        value: filter_sex,
        items: [{ label: t("Female"), flag: 1 }, { label: t("Male"), flag: 2 }]
      },
      {
        name: t("Age"),
        key: "filter_age",
        value: filter_age,
        items: chart_data.age_ranges.map((range, i) => {
          flags_ageranges[range] = Math.pow(2, i);
          return { label: range, flag: Math.pow(2, i) };
        })
      }
    ];

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Migration By Visa Type")}</span>
          <ExportLink path={chart_data.path} />
        </h3>
        <MiniFilter onClick={this.toggleFilter} filters={filters} />
        <BarChart
          config={{
            height: 480,
            data: chart_data.raw,
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
                t("{{number}} visas", {
                  number: numeral(d["Number of visas"], locale).format(
                    "( 0,0 )"
                  )
                })
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
          dataFormat={function(data) {
            const filtered = data.filter(d => {
              const age_range = flags_ageranges[d["Age Range"]];
              return (
                d["Number of visas"] > 0 &&
                (filter_sex & d["ID Sex"]) == d["ID Sex"] &&
                (filter_age & age_range) == age_range
              );
            });
            return orderBy(filtered, ["Number of visas"], ["desc"]);

            // if (!resp.length) return [];

            // let grouped = groupBy(resp, "ID Year");
            // return Object.keys(grouped).map(function(year) {
            //   let children = orderBy(
            //     grouped[year],
            //     ["Number of visas"],
            //     ["desc"]
            //   );

            //   if (children.length > 20) {
            //     children = children.slice(0, 19).concat({
            //       ...children[0],
            //       Country: t("Others"),
            //       "Number of visas": children
            //         .slice(19)
            //         .reduce((sum, r) => sum + r["Number of visas"], 0)
            //     });
            //   }

            //   return children;
            // });
          }}
        />
        <SourceNote cube="immigration" />
      </div>
    );
  }
}

export default translate()(MigrationByVisa);
