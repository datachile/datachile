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
import NoDataAvailable from "components/NoDataAvailable";

class Services extends Section {
  static need = [
    (params, store) => {
      var geo = getGeoObject(params);
      const cube = mondrianClient.cube("casen_household");

      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";

      const services = [
        "Less Than 8 Blocks Public Transport",
        "Less Than 20 Blocks Educational Center",
        "Less Than 20 Blocks Health Center",
        "Less Than 20 Blocks Market",
        "Less Than 20 Blocks Atm",
        "Less Than 20 Blocks Sports Center",
        "Less Than 20 Blocks Green Areas",
        "Less Than 20 Blocks Community Equipment",
        "Less Than 20 Blocks Pharmacy"
      ];

      var prms = [];

      services.forEach(d => {
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
          key: "environment_services_data",
          data: _.keyBy(
            res.map((r, ix) => {
              const total = _.sumBy(r.data.data, msrName);
              const response = r.data.data.map(rr => {
                rr["total"] = total;
                rr["percentage"] = rr[msrName] / total;
                return rr;
              });
              return {
                key: services[ix],
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
    const environment_services_data = this.context.data
      .environment_services_data;
    if (!i18n.language) return null;
    const locale = i18n.language.split("-")[0];
    const geo = this.context.data.geo;

    var services = [];

    if (
      environment_services_data &&
      environment_services_data["Less Than 8 Blocks Public Transport"].values
        .response_2
    ) {
      services = [
        {
          logo: "public-transportation",
          value: numeral(
            environment_services_data["Less Than 8 Blocks Public Transport"]
              .values.response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("Less Than 8 Blocks from"),
          title: t("Public Transport")
        },
        {
          logo: "educational-center",
          value: numeral(
            environment_services_data["Less Than 20 Blocks Educational Center"]
              .values.response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Educational Center")
        },
        {
          logo: "health-center",
          value: numeral(
            environment_services_data["Less Than 20 Blocks Health Center"]
              .values.response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Health Center")
        },
        {
          logo: "market",
          value: numeral(
            environment_services_data["Less Than 20 Blocks Market"].values
              .response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Market")
        },
        {
          logo: "atm",
          value: numeral(
            environment_services_data["Less Than 20 Blocks Atm"].values
              .response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("Less Than 20 Blocks from"),
          title: t("ATM")
        },
        {
          logo: "sports-center",
          value: numeral(
            environment_services_data["Less Than 20 Blocks Sports Center"]
              .values.response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Sport Center")
        },
        {
          logo: "green-areas",
          value: numeral(
            environment_services_data["Less Than 20 Blocks Green Areas"].values
              .response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Green Areas")
        },
        {
          logo: "community-equipment",
          value: numeral(
            environment_services_data["Less Than 20 Blocks Community Equipment"]
              .values.response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Community Equipment")
        },
        {
          logo: "pharmacy",
          value: numeral(
            environment_services_data["Less Than 20 Blocks Pharmacy"].values
              .response_2.percentage,
            locale
          ).format("0.0%"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Pharmacy")
        }
      ];
    }

    return (
      <div className={className}>
        <h3 className="chart-title">{t("Main services in ") + geo.name}</h3>
        <div className="info-logo-container">
          {services.length == 0 && <NoDataAvailable text="" />}
          {services.map(d => <InfoLogoItem item={d} />)}
        </div>
        <SourceNote cube="casen_household" />
      </div>
    );
  }
}

export default translate()(Services);
