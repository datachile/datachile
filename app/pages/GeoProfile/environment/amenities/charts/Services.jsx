import React from "react";
import keyBy from "lodash/keyBy";
import sumBy from "lodash/sumBy";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

import InfoLogoItem from "components/InfoLogoItem";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

class Services extends Section {
  static need = [
    (params, store) => {
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

      const createPromises = (geo, msrName) => {
        var prms = [];

        services.forEach(d => {
          prms.push(
            mondrianClient.cube("casen_household").then(cube => {
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

        return prms;
      };

      const parseResponse = (res, msrName, available) => {
        return {
          available: available,
          data: keyBy(
            res.map((r, ix) => {
              const total = sumBy(r.data.data, msrName);
              const response = r.data.data.map(rr => {
                rr["total"] = total;
                rr["percentage"] = rr[msrName] / total;
                return rr;
              });
              return {
                key: services[ix],
                expansion_factor_total: total,
                values: keyBy(response, function(o) {
                  return "response_" + o["ID Binary Survey Response"];
                })
              };
            }),
            "key"
          )
        };
      };

      var geo = getGeoObject(params);

      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";

      var prms = createPromises(geo, msrName);

      var prm = Promise.all(prms).then(res => {
        if (res[0].data.data.length == 0) {
          return {
            key: "environment_services_data",
            data: {
              available: false,
              data: []
            }
          };
        } else {
          return {
            key: "environment_services_data",
            data: parseResponse(res, msrName, true)
          };
        }
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

    const locale = i18n.locale;
    const geo = this.context.data.geo;

    var services = [];

    if (environment_services_data) {
      services = [
        {
          logo: "public-transportation",
          value: environment_services_data.available
            ? numeral(
                environment_services_data.data[
                  "Less Than 8 Blocks Public Transport"
                ].values.response_2.percentage,
                locale
              ).format("0.0%")
            : t("no_datum"),
          verb: t("Less Than 8 Blocks from"),
          title: t("Public Transport")
        },
        {
          logo: "educational-center",
          value: environment_services_data.available
            ? numeral(
                environment_services_data.data[
                  "Less Than 20 Blocks Educational Center"
                ].values.response_2.percentage,
                locale
              ).format("0.0%")
            : t("no_datum"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Educational Center")
        },
        {
          logo: "health-center",
          value: environment_services_data.available
            ? numeral(
                environment_services_data.data[
                  "Less Than 20 Blocks Health Center"
                ].values.response_2.percentage,
                locale
              ).format("0.0%")
            : t("no_datum"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Health Center")
        },
        {
          logo: "market",
          value: environment_services_data.available
            ? numeral(
                environment_services_data.data["Less Than 20 Blocks Market"]
                  .values.response_2.percentage,
                locale
              ).format("0.0%")
            : t("no_datum"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Market")
        },
        {
          logo: "atm",
          value: environment_services_data.available
            ? numeral(
                environment_services_data.data["Less Than 20 Blocks Atm"].values
                  .response_2.percentage,
                locale
              ).format("0.0%")
            : t("no_datum"),
          verb: t("Less Than 20 Blocks from"),
          title: t("ATM")
        },
        {
          logo: "sports-center",
          value: environment_services_data.available
            ? numeral(
                environment_services_data.data[
                  "Less Than 20 Blocks Sports Center"
                ].values.response_2.percentage,
                locale
              ).format("0.0%")
            : t("no_datum"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Sport Center")
        },
        {
          logo: "green-areas",
          value: environment_services_data.available
            ? numeral(
                environment_services_data.data[
                  "Less Than 20 Blocks Green Areas"
                ].values.response_2.percentage,
                locale
              ).format("0.0%")
            : t("no_datum"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Green Areas")
        },
        {
          logo: "community-equipment",
          value: environment_services_data.available
            ? numeral(
                environment_services_data.data[
                  "Less Than 20 Blocks Community Equipment"
                ].values.response_2.percentage,
                locale
              ).format("0.0%")
            : t("no_datum"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Community Equipment")
        },
        {
          logo: "pharmacy",
          value: environment_services_data.available
            ? numeral(
                environment_services_data.data["Less Than 20 Blocks Pharmacy"]
                  .values.response_2.percentage,
                locale
              ).format("0.0%")
            : t("no_datum"),
          verb: t("Less Than 20 Blocks from"),
          title: t("Pharmacy")
        }
      ];
    }

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Main services in ")} {geo.name}
          </span>
        </h3>
        <div className="info-logo-container">
          {services.map((d, i) => <InfoLogoItem item={d} key={i} />)}
        </div>
        <SourceNote cube="casen_household" />
      </div>
    );
  }
}

export default translate()(Services);
