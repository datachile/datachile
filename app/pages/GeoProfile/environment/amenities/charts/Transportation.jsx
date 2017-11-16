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

class Transportation extends Section {
  static need = [
    (params, store) => {
      var geo = getGeoObject(params);
      const cube = mondrianClient.cube("casen_household");

      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";

      const transortations = [
        "Less Than 8 Blocks Public Transport",
        "Less Than 20 Blocks Educational Center",
        "Tablet Access",
        "Cellphone Access",
        "Games or Consoles Access",
        "TV Access"
      ];

      var prms = [];

      transortations.forEach(d => {
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
                .measure(msrName),
              store.i18n.locale
            );

            return mondrianClient.query(q, "jsonrecords");
          })
        );
      });

      var prm = Promise.all(prms).then(res => {
        return {
          key: "environment_transportation_data",
          data: _.keyBy(
            res.map((r, ix) => {
              const total = _.sumBy(r.data.data, msrName);
              const response = r.data.data.map(rr => {
                rr["total"] = total;
                rr["percentage"] = rr[msrName] / total;
                return rr;
              });
              return {
                key: transortations[ix],
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
    const environment_transportation_data = this.context.data
      .environment_transportation_data;
    const locale = i18n.language.split("-")[0];
    const geo = this.context.data.geo;

    var transortations = [];
    if (false) {
      transortations = [
        {
          logo: "phone",
          value: numeral(
            environment_transportation_data["Cellphone Access"].values
              .response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Mobile phone")
        },
        {
          logo: "desktop",
          value: numeral(
            environment_transportation_data["Desktop Access"].values.response_2
              .percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Desktop computer")
        },
        {
          logo: "tv",
          value: numeral(
            environment_transportation_data["TV Access"].values.response_2
              .percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Smart TV")
        },
        {
          logo: "laptop",
          value: numeral(
            environment_transportation_data["Laptop Access"].values.response_2
              .percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Laptop computer")
        },
        {
          logo: "tablet",
          value: numeral(
            environment_transportation_data["Tablet Access"].values.response_2
              .percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Tablet")
        },
        {
          logo: "console",
          value: numeral(
            environment_transportation_data["Games or Consoles Access"].values
              .response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("use device"),
          title: t("Videogame console")
        }
      ];
    }

    return (
      <div className={className}>
        <h3 className="chart-title">{t("Transportation")}</h3>
        <div className="device-container">
          {transortations.map(d => <InfoLogoItem item={d} />)}
        </div>
      </div>
    );
  }
}

export default translate()(Transportation);
