import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";
import sumBy from "lodash/sumBy";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

import InfoLogoItem from "components/InfoLogoItem";
import SourceTooltip from "components/SourceTooltip";

class Devices extends Section {
  static need = [];

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
          <span>
            {t("Devices' use in ") + geoChartName}
            <SourceTooltip cube="internet_access" />
          </span>
        </h3>
        <div className="info-logo-container">{devices}</div>
      </div>
    );
  }
}

export default translate()(Devices);
