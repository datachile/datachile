import React, { Component } from "react";

import { Treemap } from "d3plus-react";
import mondrianClient, {
  setLangCaptions,
  getMeasureByGeo
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import ExportLink from "components/ExportLink";

class SpendingBySector extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject({ region: params.region, comuna: undefined });

      const regionID =
        typeof geo.ancestor != "undefined" ? geo.ancestor.key : "";
      const measureName = getMeasureByGeo(
        geo.type,
        "Total Spending",
        "gasto_region_" + geo.key,
        "gasto_region_" + regionID
      );

      const prm = mondrianClient.cube("rd_survey").then(cube => {
        var q = setLangCaptions(
          cube.query
            .option("parents", true)
            .drilldown("Date", "Date", "Year")
            .drilldown("Ownership Type", "Ownership Type", "Ownership Type")
            .measure(measureName),
          store.i18n.locale
        );

        return {
          key: "path_spending_by_sector",
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
    const path = this.context.data.path_spending_by_sector;
    const { t, className, i18n } = this.props;
    const locale = i18n.locale;

    const geo = this.context.data.geo;
    const regionID = geo.type === "comuna" ? geo.ancestors[0].key : "";
    const measureName = getMeasureByGeo(
      geo.type,
      "Total Spending",
      "gasto_region_" + geo.key,
      "gasto_region_" + regionID
    );

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("R&D Spending By Sector")}{" "}
            {geo && geo.type == "comuna" && t("Regional")}
          </span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: "ID Ownership Type",
            label: d => d["Ownership Type"],
            sum: d => d[measureName],
            total: d => d[measureName],
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(d.text.split(": ")[1], locale).format("$ (0,0)")
            },
            time: "ID Year",
            total: d => d[measureName],
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(d.text.split(": ")[1], locale).format("($ 0.00 a)")
            },
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID Ownership Type"])
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 25,
                height: 25,
                fill: d => ordinalColorScale(d["ID Ownership Type"]),
                backgroundImage: d =>
                  "https://datausa.io/static/img/attrs/thing_apple.png"
              }
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(SpendingBySector);
