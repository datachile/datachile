import React from "react";
import _ from "lodash";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { COLORS_SURVEY_RESPONSE } from "helpers/colors";
import { numeral } from "helpers/formatters";

class InternetAccessByZone extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const prm = mondrianClient.cube("internet_access").then(cube => {
        var q = geoCut(
          geo,
          "Geography",
          cube.query
            .drilldown("Zone", "Zone", "Zone")
            .drilldown(
              "Home Access",
              "Binary Survey Response",
              "Survey Response"
            )
            .measure("Expansion factor"),
          store.i18n.locale
        );

        return {
          key: "path_internet_access",
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
    const path = this.context.data.path_internet_access;
    const locale = i18n.language.split("-")[0];
    console.warn(path);
    const geo = this.context.data.geo;

    return (
      <div className={className}>
        <h3 className="chart-title">{t("Internet Access By Zone")}</h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: "ID Survey Response",
            label: d => d["ID Survey Response"],
            x: "Zone",
            y: "Expansion factor",
            shapeConfig: {
              fill: d => COLORS_SURVEY_RESPONSE[d["ID Survey Response"]],
              label: false
            },
            xConfig: {
              tickSize: 0,
              title: t("Zone")
            },
            yConfig: {
              barConfig: { "stroke-width": 0 },
              tickSize: 0,
              title: false,
              tickFormat: tick => numeral(tick, locale).format("(0.0 a)")
            },
            barPadding: 0,
            groupPadding: 10,
            tooltipConfig: {
              title: d => d["Zone"] + " - " + d["Survey Response"],
              body: d =>
                `${numeral(d["Expansion factor"], locale).format(
                  "( 0,0 )"
                )} ${t(" people")}`
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d =>
                  "/images/legend/survey_response/" +
                  d["ID Survey Response"] +
                  ".png"
              }
            }
          }}
          dataFormat={data => {
            return data.data;
          }}
        />
      </div>
    );
  }
}

export default translate()(InternetAccessByZone);
