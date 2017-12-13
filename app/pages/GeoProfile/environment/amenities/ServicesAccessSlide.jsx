import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";
import mondrianClient, {
  geoCut,
  simpleFallbackGeoDatumNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class ServicesAccessSlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";
      return simpleFallbackGeoDatumNeed(
        "datum_network_electricity_households",
        "casen_household",
        [msrName],
        {
          drillDowns: [["Electricity", "Electricity", "Electricity"]],
          options: { parents: false },
          cuts: [
            `[Date].[Date].[Year].&[${sources.casen_household.year}]`,
            "{[Electricity].[Electricity].[Electricity].&[1],[Electricity].[Electricity].[Electricity].&[2],[Electricity].[Electricity].[Electricity].&[3]}"
          ]
        }
      )(params, store);
    },
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";
      return simpleFallbackGeoDatumNeed(
        "datum_household_total",
        "casen_household",
        [msrName],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${sources.casen_household.year}]`]
        }
      )(params, store);
    }
  ];

  render() {
    const { children, t, i18n } = this.props;
    const {
      datum_network_electricity_households,
      datum_household_total,
      geo
    } = this.context.data;

    const locale = i18n.locale;

    const area = datum_network_electricity_households.fallback
      ? geo.ancestors[0].caption
      : geo.caption;

    const total_network_electricity = _.sum(
      datum_network_electricity_households.data
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Services Access")}</div>
          <div className="topic-slide-text">
            {datum_network_electricity_households &&
              datum_network_electricity_households.fallback && (
                <p>{t("no_info", { yes: area, no: geo.caption })}</p>
              )}
            <p>
              Aliquam erat volutpat. Nunc eleifend leo vitae magna. In id erat
              non orci commodo lobortis. Proin neque massa, cursus ut, gravida
              ut, lobortis eget, lacus.
            </p>
          </div>
          <div className="topic-slide-data">
            {datum_network_electricity_households &&
              datum_household_total && (
                <FeaturedDatum
                  className="l-1-3"
                  icon="empleo"
                  datum={numeral(
                    total_network_electricity / datum_household_total.data,
                    locale
                  ).format("(0.0%)")}
                  title={t("Connected to electricity network")}
                  subtitle={
                    numeral(total_network_electricity, locale).format(
                      "(0.0 a)"
                    ) +
                    t(" in ") +
                    area
                  }
                />
              )}
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(ServicesAccessSlide)
);
