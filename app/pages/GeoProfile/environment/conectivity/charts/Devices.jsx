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

class Devices extends Section {
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

    const devices = [
      {
        logo: "phone",
        value: "xx%",
        verb: "utiliza dispositivo",
        title: "telefonía Movil"
      },
      {
        logo: "desktop",
        value: "xx%",
        verb: "utiliza dispositivo",
        title: "Computador escritorio"
      },
      {
        logo: "tv",
        value: "xx%",
        verb: "utiliza dispositivo",
        title: "Smart TV"
      },
      {
        logo: "laptop",
        value: "xx%",
        verb: "utiliza dispositivo",
        title: "Laptop"
      },
      {
        logo: "tablet",
        value: "xx%",
        verb: "utiliza dispositivo",
        title: "Tablet"
      },
      {
        logo: "console",
        value: "xx%",
        verb: "utiliza dispositivo",
        title: "Videogame Console"
      }
    ];

    return (
      <div className={className}>
        <h3 className="chart-title">{t("Devices")}</h3>
        <div className="device-container">
          {devices.map(d => <InfoLogoItem item={d} />)}
        </div>
      </div>
    );
  }
}

export default translate()(Devices);
