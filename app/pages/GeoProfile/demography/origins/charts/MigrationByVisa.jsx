import React from "react";
import { Section } from "datawheel-canon";
import _ from "lodash";
import { translate } from "react-i18next";
import { BarChart } from "d3plus-react";

import { ordinalColorScale } from "helpers/colors";
import mondrianClient, {
  geoCut,
  getMembersQuery
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

import Select from "components/Select";
import ExportLink from "components/ExportLink";

export default translate()(
  class MigrationByVisa extends Section {
    static need = [
      (params, store) => {
        const geo = getGeoObject(params);
        const prm = mondrianClient.cube("immigration").then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", true)
              .drilldown("Date", "Date", "Year")
              .drilldown("Origin Country", "Country", "Country")
              .measure("Number of visas")
              .cut("[Visa Type].[Visa Type].[Visa Type].&[3]"),
            store.i18n.locale
          );
          return {
            key: "path_migration_by_visa_type",
            data: store.env.CANON_API + q.path("jsonrecords")
          };
        });

        return {
          type: "GET_DATA",
          promise: prm
        };
      },
      (params, store) => {
        const geo = getGeoObject(params);
        var prm1 = getMembersQuery(
          "immigration",
          "Visa Type",
          "Visa Type",
          store.i18n.locale,
          false
        );
        var prm2 = mondrianClient.cube("immigration");

        const prm = Promise.all([prm1, prm2]).then(resp => {
          var types = resp[0];
          types.shift(); //nan
          var cube = resp[1];
          return {
            key: "visa_types_with_path",
            data: types.map(t => {
              var q = geoCut(
                geo,
                "Geography",
                cube.query
                  .option("parents", true)
                  .drilldown("Date", "Date", "Year")
                  .drilldown("Origin Country", "Country", "Country")
                  .measure("Number of visas")
                  .cut("[Visa Type].[Visa Type].[Visa Type].&[" + t.key + "]"),
                store.i18n.locale
              );
              t.path = store.env.CANON_API + q.path("jsonrecords");
              return t;
            })
          };
        });

        return {
          type: "GET_DATA",
          promise: prm
        };
      }
    ];

    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        selectedOption: 0,
        selectedObj: {
          path: ""
        },
        chartVariations: []
      };
    }

    componentDidMount() {
      const { t } = this.props;

      var variations = this.context.data.visa_types_with_path;

      this.setState({
        selectedOption: 0,
        selectedObj: variations[0],
        chartVariations: variations
      });
    }

    handleChange(ev) {
      this.setState({
        selectedOption: ev.newValue,
        selectedObj: this.state.chartVariations[ev.newValue]
      });
    }

    render() {
      const { t, className, i18n } = this.props;
      const path = this.context.data.path_migration_by_visa_type;
      if (!i18n.language) return null;
      const locale = i18n.language.split("-")[0];

      return (
        <div className={className}>
          <h3 className="chart-title">
            <span>{t("Migration By Visa Type")}</span>
            <Select
              id="variations"
              options={this.state.chartVariations}
              value={this.state.selectedOption}
              labelField="caption"
              valueField="key"
              onChange={this.handleChange}
            />
          </h3>
          <BarChart
            config={{
              height: 500,
              data: this.state.selectedObj.path,
              groupBy: "ID Country",
              label: d => d["Country"],
              time: "ID Year",
              x: "Number of visas",
              y: "Country",
              shapeConfig: {
                fill: d => ordinalColorScale(3),
                label: false
              },
              discrete: "y",
              xConfig: {
                tickSize: 0,
                title: t("Number of visas")
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
                title: d => d["Country"],
                body: d =>
                  numeral(d["Number of visas"], locale).format("( 0,0 )") +
                  " " +
                  t("visas")
              },
              legendConfig: {
                label: false,
                shapeConfig: false
              }
            }}
            dataFormat={function(data) {
              var others = {};
              var limit = 0;
              var resp = [];
              if (data.data.length > 0) {
                var grouped = _.map(_.groupBy(data.data, "ID Year"), function(
                  children,
                  year
                ) {
                  children = _.orderBy(
                    _.filter(
                      children,
                      o =>
                        o["Number of visas"] != null &&
                        o["Number of visas"] != 0
                    ),
                    ["Number of visas"],
                    ["desc"]
                  );
                  if (children.length > 20) {
                    limit = children[19]["Number of visas"];
                    var othersCount = _.reduce(
                      _.filter(children, o => o["Number of visas"] <= limit),
                      (sum, r) => sum + r["Number of visas"],
                      0
                    );
                    var others = _.clone(children[0]);
                    others["Number of visas"] = othersCount;
                    others["Country"] = t("Others");
                    children = _.filter(
                      children,
                      o => o["Number of visas"] > limit
                    );
                    children.push(others);
                  }
                  return children;
                });

                resp = _.flatMap(grouped, m => m);
              }

              return resp;
            }}
          />
        </div>
      );
    }
  }
);
