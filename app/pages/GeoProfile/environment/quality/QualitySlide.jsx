import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { sources } from "helpers/consts";

import mondrianClient, {
  geoCut,
  simpleDatumNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";

import { numeral } from "helpers/formatters";
import FeaturedDatum from "components/FeaturedDatum";

class QualitySlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";
      return simpleDatumNeed(
        "datum_rural_households",
        "casen_household",
        [msrName],
        {
          drillDowns: [["Zone Id", "Zone Id", "Zone Id"]],
          options: { parents: false },
          cuts: [
            `[Date].[Date].[Year].&[${sources.casen_household.year}]`,
            "[Zone Id].[Zone Id].[Zone Id].&[2]"
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
      return simpleDatumNeed(
        "datum_less_30mts_sq",
        "casen_household",
        [msrName],
        {
          drillDowns: [
            [
              "Household Sq Meters",
              "Household Sq Meters",
              "Household Sq Meters"
            ]
          ],
          options: { parents: false },
          cuts: [
            `[Date].[Date].[Year].&[${sources.casen_household.year}]`,
            "[Household Sq Meters].[Household Sq Meters].[Household Sq Meters].&[1]"
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
      return simpleDatumNeed(
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
      datum_rural_households,
      datum_less_30mts_sq,
      datum_household_total,
      geo
    } = this.context.data;

    const locale = i18n.locale;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Quality")}</div>
          <div className="topic-slide-text">
            Aliquam erat volutpat. Nunc eleifend leo vitae magna. In id erat non
            orci commodo lobortis. Proin neque massa, cursus ut, gravida ut,
            lobortis eget, lacus. Sed diam. Praesent fermentum tempor tellus.
            Nullam tempus. Mauris ac felis vel velit tristique imperdiet. Donec
            at pede. Etiam vel neque nec dui dignissim bibendum. Vivamus id
            enim. Phasellus neque orci, porta a, aliquet quis, semper a, massa.
            Phasellus purus. Pellentesque tristique imperdiet tortor. Nam
            euismod tellus id erat.
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(datum_rural_households, locale).format("(0,0)")}
              title={t("Rural households")}
              subtitle={
                numeral(
                  datum_rural_households / datum_household_total,
                  locale
                ).format("(0.0%)") +
                t(" of ") +
                geo.caption
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(datum_less_30mts_sq, locale).format("(0,0)")}
              title={t("Less than 30 square meter households")}
              subtitle={
                numeral(
                  datum_less_30mts_sq / datum_household_total,
                  locale
                ).format("(0.0%)") +
                t(" of ") +
                geo.caption
              }
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
  )(QualitySlide)
);
