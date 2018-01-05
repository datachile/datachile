import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import flattenDeep from "lodash/flattenDeep";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";
import { sources } from "helpers/consts";

import FeaturedDatum from "components/FeaturedDatum";

class DevicesSlide extends Section {
  static need = [
    (params, store) => {
      let geo = getGeoObject(params);
      if (geo.type == "comuna") geo = geo.ancestor;

      const promise = mondrianClient
        .cube("internet_access")
        .then(cube => {
          const query = cube.query
            .drilldown(
              "Tablet Access",
              "Binary Survey Response",
              "Binary Survey Response"
            )
            .drilldown(
              "Cellphone Access",
              "Binary Survey Response",
              "Binary Survey Response"
            )
            .measure("Expansion factor")
            .option("parents", false);

          return mondrianClient.query(
            geoCut(geo, "Geography", query, store.i18n.locale),
            "jsonrecords"
          );
        })
        .then(result => {
          return {
            key: "datum_household_devices_small",
            data: result.data.data.reduce(
              (sum, answer) =>
                sum +
                (answer["ID Binary Survey Response"] == 2
                  ? answer["Expansion factor"] || 0
                  : 0),
              0
            )
          };
        });

      return { type: "GET_DATA", promise };
    },
    (params, store) => {
      let geo = getGeoObject(params);
      if (geo.type == "comuna") geo = geo.ancestor;

      const promise = mondrianClient
        .cube("internet_access")
        .then(cube => {
          const query = cube.query
            .drilldown(
              "Games or Consoles Access",
              "Binary Survey Response",
              "Binary Survey Response"
            )
            .drilldown(
              "TV Access",
              "Binary Survey Response",
              "Binary Survey Response"
            )
            .measure("Expansion factor")
            .option("parents", false);

          return mondrianClient.query(
            geoCut(geo, "Geography", query, store.i18n.locale),
            "jsonrecords"
          );
        })
        .then(result => {
          return {
            key: "datum_household_devices_uncommon",
            data: result.data.data.reduce(
              (sum, answer) =>
                sum +
                (answer["ID Binary Survey Response"] == 2
                  ? answer["Expansion factor"] || 0
                  : 0),
              0
            )
          };
        });

      return { type: "GET_DATA", promise };
    }
  ];

  render() {
    const { children, t, i18n } = this.props;
    const locale = i18n.language;

    let {
      datum_household_devices_small,
      datum_household_devices_uncommon,
      geo,
      internet_data
    } = this.context.data;

    if (geo.type === "comuna") {
      geo = { ...geo.ancestors[0] };
    }

    const expf_desktop =
      internet_data["Desktop Access"].response_2["Expansion factor"];
    const expf_laptop =
      internet_data["Laptop Access"].response_2["Expansion factor"];
    const expf_phone =
      internet_data["Cellphone Access"].response_2["Expansion factor"];
    const expf_tablet =
      internet_data["Tablet Access"].response_2["Expansion factor"];
    const expf_smarttv =
      internet_data["TV Access"].response_2["Expansion factor"];
    const expf_console =
      internet_data["Games or Consoles Access"].response_2["Expansion factor"];

    const bitwise_access =
      (expf_phone > 0 ? 1 : 0) ^
      (expf_laptop > 0 ? 2 : 0) ^
      (expf_desktop > 0 ? 4 : 0);

    const txt_slide = t("geo_profile.housing.connectivity.text", {
      context: internet_data.total > 0 ? bitwise_access.toString() : "none",
      level: geo.name,
      year_last: sources.internet_access.year,
      access_desktop: numeral(expf_desktop, locale).format("(0,0)"),
      access_laptop: numeral(expf_laptop, locale).format("(0,0)"),
      access_mobile: numeral(expf_phone, locale).format("(0,0)"),
      access_total: numeral(internet_data.total, locale).format("(0,0)")
    });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Devices")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(internet_data.total, locale).format("(0,0 a)")}
              title={t("Internet Access")}
              subtitle={`${t("in")} ${geo.name} - ${
                sources.internet_access.year
              }`}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(datum_household_devices_small, locale).format(
                "(0,0 a)"
              )}
              title={t("Use small screens")}
              subtitle={t("to access the internet")}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(datum_household_devices_uncommon, locale).format(
                "(0,0 a)"
              )}
              title={t("Use unconventional internet browser")}
              subtitle={t("on Smart TV or Gaming Console")}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(DevicesSlide);
