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

class HealthInsurance extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const prm = mondrianClient.cube("casen_health_system").then(cube => {
        var query = cube.query
          .option("parents", true)
          .drilldown("Date", "Date", "Year")
          .drilldown("Health System", "Health System", "Health System")
          .measure(
            geo.type == "comuna"
              ? "Expansion Factor Comuna"
              : "Expansion Factor Region"
          );

        var q = geoCut(geo, "Geography", query, store.i18n.locale);

        return {
          key: "path_health_insurance",
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
    const path = this.context.data.path_health_insurance;
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;

    const locale = i18n.locale;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Access to Health Insurance")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Health System Group", "ID Health System"],
            label: d => d["Health System"],
            sum: d =>
              geo.type == "comuna"
                ? d["Expansion Factor Comuna"]
                : d["Expansion Factor Region"],
            time: "ID Year",
            total: d =>
              geo.type == "comuna"
                ? d["Expansion Factor Comuna"]
                : d["Expansion Factor Region"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(d.text.split(": ")[1], locale).format("0,0") +
                " " +
                t("people")
            },
            shapeConfig: {
              fill: d =>
                ordinalColorScale("health" + d["ID Health System Group"])
            },
            legendConfig: {
              label: d => d["Health System Group"],
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d =>
                  "/images/legend/college/administration.png"
              }
            }
          }}
          dataFormat={data => data.data.filter(h => h["ID Health System"] != 0)}
        />
        <SourceNote cube="casen_health_system" />
      </div>
    );
  }
}

export default translate()(HealthInsurance);
