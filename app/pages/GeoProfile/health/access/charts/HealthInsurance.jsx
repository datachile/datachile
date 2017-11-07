import React, { Component } from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

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
    const path = this.context.data.path_health_insurance;
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;
    const locale = i18n.language.split("-")[0];

    return (
      <div className={className}>
        <h3 className="chart-title">{t("Access to Health Insurance")}</h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Health System"],
            label: d => d["Health System"],
            sum: d =>
              geo.type == "comuna"
                ? d["Expansion Factor Comuna"]
                : d["Expansion Factor Region"],
            time: "ID Year",
            shapeConfig: {
              fill: d => ordinalColorScale("health" + d["ID Health System"])
            },
            legendConfig: {
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d =>
                  "/images/legend/college/administration.png"
              }
            }
          }}
          dataFormat={data =>
            data.data.filter(h => {
              return h["ID Health System"] != 0; //nan
            })}
        />
      </div>
    );
  }
}

export default translate()(HealthInsurance);
