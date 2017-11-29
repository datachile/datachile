import React from "react";
import _ from "lodash";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { COLORS_SURVEY_RESPONSE } from "helpers/colors";
import { numeral } from "helpers/formatters";

import InfoLogoItem from "components/InfoLogoItem";
import SourceNote from "components/SourceNote";

class Devices extends Section {
  static need = [
    (params, store) => {
      var geo = getGeoObject(params);
      const cube = mondrianClient.cube("internet_access");

      //force to region query on comuna profile
      if (geo.type == "comuna") {
        geo = geo.ancestor;
      }

      const devices = [
        "Desktop Access",
        "Laptop Access",
        "Tablet Access",
        "Cellphone Access",
        "Games or Consoles Access",
        "TV Access"
      ];

      var prms = [];

      devices.forEach(d => {
        prms.push(
          cube.then(cube => {
            var q = geoCut(
              geo,
              "Geography",
              cube.query
                .drilldown(
                  d,
                  "Binary Survey Response",
                  "Binary Survey Response"
                )
                .measure("Number of records")
                .measure("Expansion factor"),
              store.i18n.locale
            );

            return mondrianClient.query(q, "jsonrecords");
          })
        );
      });

      var prm = Promise.all(prms).then(res => {
        return {
          key: "internet_data",
          data: _.keyBy(
            res.map((r, ix) => {
              const total = _.sumBy(r.data.data, "Expansion factor");
              const response = r.data.data.map(rr => {
                rr["total"] = total;
                rr["percentage"] = rr["Expansion factor"] / total;
                return rr;
              });
              return {
                key: devices[ix],
                expansion_factor_total: total,
                values: _.keyBy(response, function(o) {
                  return "response_" + o["ID Binary Survey Response"];
                })
              };
            }),
            "key"
          )
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
    const internet_data = this.context.data.internet_data;
    if (!i18n.language) return null;
    const locale = i18n.language.split("-")[0];
    const geo = this.context.data.geo;

    const geoChartName =
      geo.type == "comuna" ? geo.ancestors[0].caption : geo.caption;

    var devices = [];
    if (internet_data) {
      devices = [
        {
          logo: "phone",
          value: numeral(
            internet_data["Cellphone Access"].values.response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Mobile phone")
        },
        {
          logo: "desktop",
          value: numeral(
            internet_data["Desktop Access"].values.response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Desktop computer")
        },
        {
          logo: "tv",
          value: numeral(
            internet_data["TV Access"].values.response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Smart TV")
        },
        {
          logo: "laptop",
          value: numeral(
            internet_data["Laptop Access"].values.response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Laptop computer")
        },
        {
          logo: "tablet",
          value: numeral(
            internet_data["Tablet Access"].values.response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Tablet")
        },
        {
          logo: "console",
          value: numeral(
            internet_data["Games or Consoles Access"].values.response_2
              .percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Videogame console")
        }
      ];
    }

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Devices' use in ") + geoChartName}</span>
        </h3>
        <div className="info-logo-container">
          {devices.map(d => <InfoLogoItem item={d} />)}
        </div>
        <SourceNote cube="internet_access" />
      </div>
    );
  }
}

export default translate()(Devices);
