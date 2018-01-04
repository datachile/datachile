import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import sumBy from "lodash/sumBy";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
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

      var prms = devices.map(d => {
        return cube.then(cube => {
          const query = cube.query
            .drilldown(d, "Binary Survey Response", "Binary Survey Response")
            .measure("Number of records")
            .measure("Expansion factor");
          const q = geoCut(geo, "Geography", query, store.i18n.locale);

          return mondrianClient.query(q, "jsonrecords");
        });
      });

      const empty_answer = { Percentage: 0 };
      const promise = Promise.all(prms).then(results => ({
        key: "internet_data",
        data: results.reduce(function(output, result, i) {
          const key = devices[i];
          const total = sumBy(result.data.data, "Expansion factor");

          output["total"] = total;
          output[key] = result.data.data.reduce(
            function(answers, answer) {
              const key = "response_" + answer["ID Binary Survey Response"];
              answer["Percentage"] = answer["Expansion factor"] / total;
              answer["Total expansion factor"] = total;

              answers[key] = answer;
              return answers;
            },
            {
              response_0: empty_answer,
              response_1: empty_answer,
              response_2: empty_answer
            }
          );

          return output;
        }, {})
      }));

      return { type: "GET_DATA", promise };
    }
  ];

  render() {
    const { t, className, i18n } = this.props;
    const locale = i18n.language;

    const { geo, internet_data } = this.context.data;

    const geoChartName =
      geo.type == "comuna" ? geo.ancestors[0].caption : geo.caption;

    const devices = [
      {
        logo: "phone",
        raw_value: internet_data["Cellphone Access"].response_2["Percentage"],
        value: numeral(
          internet_data["Cellphone Access"].response_2["Percentage"],
          locale
        ).format("0.0%"),
        verb: t("use device"),
        title: t("Mobile phone")
      },
      {
        logo: "desktop",
        raw_value: internet_data["Desktop Access"].response_2["Percentage"],
        value: numeral(
          internet_data["Desktop Access"].response_2["Percentage"],
          locale
        ).format("0.0%"),
        verb: t("use device"),
        title: t("Desktop computer")
      },
      {
        logo: "tv",
        raw_value: internet_data["TV Access"].response_2["Percentage"],
        value: numeral(
          internet_data["TV Access"].response_2["Percentage"],
          locale
        ).format("0.0%"),
        verb: t("use device"),
        title: t("Smart TV")
      },
      {
        logo: "laptop",
        raw_value: internet_data["Laptop Access"].response_2["Percentage"],
        value: numeral(
          internet_data["Laptop Access"].response_2["Percentage"],
          locale
        ).format("0.0%"),
        verb: t("use device"),
        title: t("Laptop computer")
      },
      {
        logo: "tablet",
        raw_value: internet_data["Tablet Access"].response_2["Percentage"],
        value: numeral(
          internet_data["Tablet Access"].response_2["Percentage"],
          locale
        ).format("0.0%"),
        verb: t("use device"),
        title: t("Tablet")
      },
      {
        logo: "console",
        raw_value:
          internet_data["Games or Consoles Access"].response_2["Percentage"],
        value: numeral(
          internet_data["Games or Consoles Access"].response_2["Percentage"],
          locale
        ).format("0.0%"),
        verb: t("use device"),
        title: t("Videogame console")
      }
    ]
      .sort((a, b) => b.raw_value - a.raw_value)
      .map(d => <InfoLogoItem key={d.logo} item={d} />);

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Devices' use in ") + geoChartName}</span>
        </h3>
        <div className="info-logo-container">{devices}</div>
        <SourceNote cube="internet_access" />
      </div>
    );
  }
}

export default translate()(Devices);
