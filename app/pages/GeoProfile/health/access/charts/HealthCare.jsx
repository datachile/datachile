import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class HealthCare extends Section {
  static need = [
    (params, store) => {
      let geo = getGeoObject(params);
      if (geo.type === "comuna") {
        geo = { ...geo.ancestor };
      }
      const prm = mondrianClient.cube("health_access").then(cube => {
        var q = geoCut(
          geo,
          "Geography",
          cube.query
            .option("parents", true)
            .drilldown("Date", "Date", "Year")
            .measure("Primary Healthcare SUM")
            .measure("Specialized Healthcare SUM")
            .measure("Urgency Healthcare SUM")
            .measure("Primary Healthcare AVG")
            .measure("Specialized Healthcare AVG")
            .measure("Urgency Healthcare AVG")
        );

        return {
          key: "path_health_healthcare",
          data: __API__ + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const path = this.context.data.path_health_healthcare;
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Healthcare by Type")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            label: d => t(d["label"]),
            time: "ID Year",
            groupBy: "label",
            total: d => d["value"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(d.text.split(": ")[1], locale).format("0,0") +
                " " +
                t("health cares")
            },
            tooltipConfig: {
              body: d =>
                "<div>" +
                t("Total") +
                ": " +
                numeral(d.value, locale).format("0,0") +
                "</div><div>" +
                t("Average") +
                ": " +
                numeral(d.avg, locale).format("0,0") +
                "</div>"
            },
            shapeConfig: {
              fill: d => ordinalColorScale(d["label"])
            },
            legendConfig: {
              label: d => d["label"],
              shapeConfig: {
                width: 40,
                height: 40
              }
            }
          }}
          dataFormat={data => {
            return data.data.reduce((all, item) => {
              all.push({
                "ID Year": item["ID Year"],
                Year: item["Year"],
                label: "Primary Healthcare",
                value: item["Primary Healthcare SUM"],
                avg: item["Primary Healthcare AVG"]
              });
              all.push({
                "ID Year": item["ID Year"],
                Year: item["Year"],
                label: "Specialized Healthcare",
                value: item["Specialized Healthcare SUM"],
                avg: item["Specialized Healthcare AVG"]
              });
              all.push({
                "ID Year": item["ID Year"],
                Year: item["Year"],
                label: "Urgency Healthcare",
                value: item["Urgency Healthcare SUM"],
                avg: item["Urgency Healthcare AVG"]
              });
              return all;
            }, []);
          }}
        />
        <SourceNote cube="health_access" />
      </div>
    );
  }
}

export default translate()(HealthCare);
