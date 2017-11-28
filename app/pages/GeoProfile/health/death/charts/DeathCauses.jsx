import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import { continentColorScale } from "helpers/colors";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

class DeathCauses extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const prm = mondrianClient.cube("death_causes").then(cube => {
        var q = geoCut(
          geo,
          "Geography",
          cube.query
            .option("parents", true)
            .drilldown("CIE 10", "CIE 10", "CIE 10")
            .drilldown("Date", "Date", "Year")
            .measure("Casualities Count SUM"),
          store.i18n.locale
        );
        console.log(q)
        return {
          key: "path_health_death_causes",
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
    const { t, className, i18n } = this.props;

    const path = this.context.data.path_health_death_causes;
    if (!i18n.language) return null;
    const locale = i18n.language.split("-")[0];

    return (
      <div className={className}>
        <h3 className="chart-title">{t("Death Causes By Casualities")}</h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["CIE 10"],
            /*label: d => {
                d["Country"] =
                  d["Country"] == "Chile" ? ["Chile"] : d["Country"];
                return d["Country"] instanceof Array
                  ? d["Continent"]
                  : d["Country"];
              },*/
            sum: d => d["Casualities Count SUM"],
            time: "Year"
            /*shapeConfig: {
                fill: d => continentColorScale(d["ID Continent"])
              },*/
            /*tooltipConfig: {
                title: d => {
                  d["Country"] =
                    d["Country"] == "Chile" ? ["Chile"] : d["Country"];
                  return d["Country"] instanceof Array
                    ? d["Continent"]
                    : d["Country"];
                },
                body: d =>
                  numeral(d["Casualities Count SUM"], locale).format("(0 a)") +
                  " " +
                  t("people")
              },*/
            /*
              legendConfig: {
                shapeConfig: {
                  width: 40,
                  height: 40,
                  backgroundImage: d =>
                    "/images/legend/continent/" + d["ID Continent"] + ".png"
                }
              }*/
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(DeathCauses);
