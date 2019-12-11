import React from "react";
import { Section } from "@datawheel/canon-core";
import { BarChart } from "d3plus-react";
import mondrianClient, {
  simpleGeoChartNeed,
  setLangCaptions
} from "helpers/MondrianClient";
import { withNamespaces } from "react-i18next";

import { sources } from "helpers/consts";
import { administrationColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceTooltip from "components/SourceTooltip";
import ExportLink from "components/ExportLink";

import CustomDialogPSU from "components/CustomDialogPSU";

class PSUDistribution extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_education_psu_distribution",
      "education_performance_new",
      ["Number of records", "Average PSU", "Average NEM"],
      {
        drillDowns: [["Institution", "Institution", "Institution"]],
        cuts: [`[Year].[Year].[Year].&[${sources.psu.year}]`],
        options: {
          parents: true,
          sparse: false,
          nonempty: false,
          distinct: true
        }
      }
    ),

    (params, store) => {
      const prm = mondrianClient
        .cube("psu")
        .then(cube => {
          var q = cube.query
            .drilldown(
              "Calculated PSU Bucket",
              "Calculated PSU Bucket",
              "Bucket"
            )
            .measure("Number of records")
            .option("parents", true)
            .option("sparse", false)
            .option("nonempty", false)
            .cut(`[Date].[Year].&[${sources.psu.year}]`);

          return mondrianClient.query(
            setLangCaptions(q, store.i18n.locale),
            "jsonrecords"
          );
        })
        .then(res => {
          return {
            key: "education_psu_distribution_chile",
            data: res.data.data
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
    this.state = {
      dialogHeader: "",
      dialogBody: [],
      isOpen: false
    };
    this.toggleDialog = this.toggleDialog.bind(this);
  }

  componentDidMount() {
    this.setState({
      isOpen: false
    });
  }

  componentWillReceiveProps() {
    this.setState({
      isOpen: false
    });
  }

  toggleDialog(header, body, className) {
    this.setState({
      isOpen: true,
      dialogHeader: header,
      dialogBody: body,
      className
    });
  }

  render() {
    const { t, className, i18n } = this.props;
    const {
      geo,
      path_education_psu_distribution,
      education_psu_distribution_chile
    } = this.context.data;

    const path = path_education_psu_distribution;

    const locale = i18n.language;
    const classSvg = "psu-distribution";

    return (
      <div className={className}>
        <CustomDialogPSU
          icon="inbox"
          dialogHeader={this.state.dialogHeader}
          dialogBody={this.state.dialogBody}
          isOpen={this.state.isOpen}
          className={this.state.className}
        />
        <h3 className="chart-title">
          <span>
            {t("PSU distribution")}
            <SourceTooltip cube="psu" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        <BarChart
          className={classSvg}
          config={{
            height: 400,
            data: path,
            groupBy: "geo",
            label: d => d["geo"],
            x: "ID Bucket",
            y: "percentage",
            barPadding: 2,
            groupPadding: 10,
            on: {
              click: d => {
                if (
                  geo.type === "country" ||
                  (geo.type !== "country" && d["geo"] !== "Chile")
                ) {
                  let body = d.tooltip,
                    header = d["Bucket"] + " " + d["geo"],
                    customclassName = "sned-1";
                  this.toggleDialog(header, body, customclassName);
                }
              }
            },
            shapeConfig: {
              fill: d =>
                d["geo"] == "Chile" && geo.type != "country"
                  ? "#ccc"
                  : administrationColorScale(),
              label: d => false
            },
            xConfig: {
              title: false
            },
            xSort: (a, b) => (a["ID Bucket"] > b["ID Bucket"] ? 1 : -1),
            yConfig: {
              title: t("PSU exams"),
              tickFormat: tick => numeral(tick, locale).format("0%")
            },
            legendTooltip: {
              title: d => d["geo"]
            },
            tooltipConfig: {
              title: d =>
                `<h4 class="tooltip-title">${d["geo"]}</h4>
                <h5 class="tooltip-subhead">${d["Bucket"]}</h5>`,
              body: d => {
                let body = "";
                let n_schools = 0;

                if ("tooltip" in d) {
                  const query = Object.keys(d.tooltip).map(key => {
                    return d["tooltip"][key];
                  });

                  body = `<h5>${t("Schools")}</h5><ul class="tooltip-list u-list-reset">`;

                  query.forEach(item => {
                    n_schools += 1;
                    body += `<li style='text-transform: capitalize;'>${item["Institution"].toLowerCase()}</li>`
                  });
                } else {
                  body =
                    "<div>" +
                    numeral(d["percentage"], locale).format("0%") +
                    t(" in ") +
                    d.geo +
                    "<br/>" +
                    numeral(d["Number of records"], locale).format(
                      "(0.[0]a)"
                    ) +
                    " " +
                    t("PSU exams") +
                    t(" in ") +
                    sources.psu.year +
                    "</div>";
                }

                return (
                  "<div style='overflow: hidden; max-height: 200px'>" + body + "</ul></div>"
                );
              },
              bodyStyle: {
                "max-height": "235px",
                overflow: "hidden"
              },
              footer: d => {
                if ("tooltip" in d)
                  return (
                    `<div class='tooltip-button btn'>${t("See more")}</div>`
                  );
                else return "<div />";
              }
            },
            legendConfig: {}
          }}
          dataFormat={data => {
            let interval = 150;
            let geoBuckets = {};

            // Create a geoBuckets
            while (interval <= 800) {
              geoBuckets[interval + "-" + (interval + 50)] = {
                min: interval,
                max: interval + 50,
                Bucket:
                  interval < 800
                    ? interval + "-" + (interval + 49) + " pts"
                    : "+800 pts",
                "ID Bucket":
                  interval < 800 ? interval + "-" + (interval + 49) : "+800",
                "Number of records": 0,
                geo: geo.caption,
                percentage: 0,
                schools: [],
                tooltip: {}
              };
              interval += 50;
            }

            data.data.forEach(item => {
              if (item["Average PSU"] >= 150) {
                let resto = item["Average PSU"] % 100;
                let interval =
                  item["Average PSU"] - (resto > 50 ? resto - 50 : resto);
                geoBuckets[interval + "-" + (interval + 50)][
                  "Number of records"
                ] += 1;
                geoBuckets[interval + "-" + (interval + 50)].schools.push(
                  ...item
                );
                geoBuckets[interval + "-" + (interval + 50)]["tooltip"][
                  Math.random().toString()
                ] = {
                  "Average PSU": Math.round(item["Average PSU"] * 100) / 100,
                  "Average NEM": Math.round(item["Average NEM"] * 100) / 100,
                  Institution: item["Institution"]
                };
              }
            });

            const query = Object.keys(geoBuckets).map(key => {
              return geoBuckets[key];
            });

            const geoTotal = query.reduce((all, item) => {
              return all + item["Number of records"];
            }, 0);

            const geoDist = query.map(d => {
              d.geo = geo.caption;
              d.percentage = d["Number of records"] / geoTotal;
              return d;
            });

            var total = geoDist;

            if (geo.type != "country") {
              const chileTotal = education_psu_distribution_chile.reduce(
                (acum, curr) => {
                  return acum + curr["Number of records"];
                },
                0
              );
              const chileDist = education_psu_distribution_chile.map(d => {
                d.geo = "Chile";
                d.percentage = d["Number of records"] / chileTotal;
                return d;
              });
              total = geoDist.concat(chileDist);
            }

            return total;
          }}
        />
      </div>
    );
  }
}
export default withNamespaces()(PSUDistribution);
