import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import mondrianClient, {
  simpleGeoChartNeed,
  setLangCaptions
} from "helpers/MondrianClient";
import { translate } from "react-i18next";

import { sources } from "helpers/consts";
import { administrationColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";
import NoDataAvailable from "components/NoDataAvailable";

class PSUDistribution extends Section {
  static need = [
    simpleGeoChartNeed(
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

  render() {
    const { t, className, i18n } = this.props;
    const {
      geo,
      path_education_psu_distribution,
      education_psu_distribution_chile
    } = this.context.data;

    const path = path_education_psu_distribution;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("PSU distribution")}</span>
          <ExportLink path={path} />
        </h3>

        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: "geo",
            label: d => d["geo"],
            x: "Bucket",
            y: "percentage",
            barPadding: 2,
            groupPadding: 10,
            shapeConfig: {
              fill: d =>
                d["geo"] == "Chile" ? "#ccc" : administrationColorScale(),
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
            tooltipConfig: {
              title: d => d["Bucket"] + " " + d["geo"],
              body: d =>
                numeral(d["percentage"], locale).format("0%") +
                " in " +
                d.geo +
                "<br/>" +
                numeral(d["Number of records"], locale).format("(0.[0] a)") +
                " " +
                t("PSU exams")
            },
            legendConfig: {}
          }}
          dataFormat={data => {
            const chileTotal = education_psu_distribution_chile.reduce(function(
              acum,
              curr
            ) {
              return acum + curr["Number of records"];
            },
            0);
            const geoTotal = data.data.reduce(function(acum, curr) {
              return acum + curr["Number of records"];
            }, 0);
            const geoDist = data.data.map(d => {
              d.geo = geo.caption;
              d.percentage = d["Number of records"] / geoTotal;
              return d;
            });
            const chileDist = education_psu_distribution_chile.map(d => {
              d.geo = "Chile";
              d.percentage = d["Number of records"] / chileTotal;
              return d;
            });
            return geoDist.concat(chileDist);
          }}
        />

        <SourceNote cube="psu" />
      </div>
    );
  }
}
export default translate()(PSUDistribution);
