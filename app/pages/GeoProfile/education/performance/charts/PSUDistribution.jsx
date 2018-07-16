import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import mondrianClient, {
  simpleGeoChartNeed,
  setLangCaptions,
  queryBuilder
} from "helpers/MondrianClient";
import { translate } from "react-i18next";

import { colorContrast } from "d3plus-color";

import { sources } from "helpers/consts";
import { administrationColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";
import NoDataAvailable from "components/NoDataAvailable";

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
        options: { parents: true, sparse: false, nonempty: false }
      }
    ),
    /*simpleGeoChartNeed(
      "path_education_psu_distribution",
      "psu",
      ["Number of records"],
      {
        drillDowns: [
          ["Calculated PSU Bucket", "Calculated PSU Bucket", "Bucket"]
        ],
        cuts: [`[Date].[Date].[Year].&[${sources.psu.year}]`],
        options: { parents: true, sparse: false, nonempty: false }
      }
    ),*/
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
          <span>{t("PSU distribution")}</span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        <BarChart
          className={classSvg}
          config={{
            height: 500,
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
              arrow: " ",
              arrowStyle: {
                "background-color": "#F2F2F2"
              },
              width: "300px",
              background: d => {
                if ("tooltip" in d) return administrationColorScale();
                else return "#ccc";
              },
              title: d => "<div>" + d["Bucket"] + " " + d["geo"] + "</div>",
              padding: 0,
              titleStyle: {
                "background-color": d => {
                  if ("tooltip" in d) return administrationColorScale();
                  else return "#ccc";
                },
                color: d => {
                  if ("tooltip" in d)
                    return colorContrast(administrationColorScale());
                  else return colorContrast("#ccc");
                },

                padding: "10px"
              },
              body: d => {
                let body = "";
                let n_schools = 0;

                if ("tooltip" in d) {
                  const query = Object.keys(d.tooltip).map(key => {
                    return d["tooltip"][key];
                  });

                  body =
                    "<div style='background-color: #f2f2f2; padding: 5px 10px'>" +
                    t("Schools").toUpperCase() +
                    "</div>";

                  query.forEach(item => {
                    n_schools += 1;
                    body +=
                      "<div style='padding: 5px 10px'>" +
                      item["Institution"] +
                      "</div>";
                  });
                } else {
                  body =
                    "<div style='padding: 5px 10px'>" +
                    numeral(d["percentage"], locale).format("0%") +
                    t(" in ") +
                    d.geo +
                    "<br/>" +
                    numeral(d["Number of records"], locale).format(
                      "(0.[0] a)"
                    ) +
                    " " +
                    t("PSU exams") +
                    t(" in ") +
                    sources.psu.year +
                    "</div>";
                }

                return (
                  "<div style='overflow: hidden; max-height: 200px'>" +
                  body +
                  "</div>" +
                  (n_schools > 7
                    ? "<div style='padding: 5px 10px'>...</div>"
                    : "<div />")
                );
              },
              bodyStyle: {
                "max-height": "235px",
                overflow: "hidden",
                //"text-overflow": "ellipsis",
                "background-color": "#fff",
                color: "#333"
              },
              footer: d => {
                if ("tooltip" in d)
                  return (
                    "<img style='margin: 0px 0px 0px 7px; height:18px' src='/images/icons/icon-ver-mas.svg' />" +
                    t("For more details, click here")
                  );
                else return "<div />";
              },

              footerStyle: {
                "background-color": "#F2F2F2",
                padding: "10px",
                color: "#555",
                "text-align": "right",
                display: "flex",
                "flex-direction": "row",
                "justify-items": "center",
                "margin-left": "auto",
                "flex-flow": "row-reverse"
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

        <SourceNote cube="psu" />
      </div>
    );
  }
}
export default translate()(PSUDistribution);
