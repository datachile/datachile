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

class SpendingByIndustry extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);

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
            .drilldown("ISICrev4", "ISICrev4", "Level 1")
            .measure(measureName),
          store.i18n.locale
        );

        return {
          key: "path_spending_by_industry",
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
    const path = this.context.data.path_spending_by_industry;
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
            {t("R&D Spending By Industry")}{" "}
            {geo && geo.type == "comuna" && t("Regional")}
          </span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: "ID Level 1",
            label: d => d["Level 1"],
            sum: d => d[measureName],
            time: "ID Year",
            total: d => d[measureName],
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(d.text.split(": ")[1], locale).format("$ (0,0)")
            },
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID Level 1"])
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 25,
                height: 25,
                fill: d => ordinalColorScale(d["ID Level 1"]),
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

export default translate()(SpendingByIndustry);
