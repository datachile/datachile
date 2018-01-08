import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";
import { simpleAvailableGeoDatumNeed } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral, slugifyItem } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class ServicesAccessSlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";
      return simpleAvailableGeoDatumNeed(
        "datum_household_total",
        "casen_household",
        [msrName],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${sources.casen_household.year}]`]
        }
      )(params, store);
    },
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";
      return simpleAvailableGeoDatumNeed(
        "datum_household_services_electr",
        "casen_household",
        [msrName],
        {
          drillDowns: [["Date", "Date", "Year"]],
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
      return simpleAvailableGeoDatumNeed(
        "datum_household_services_water",
        "casen_household",
        [msrName],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [
            `[Date].[Date].[Year].&[${sources.casen_household.year}]`,
            "{[Water Source].[Water Source].[Water Source].&[1],[Water Source].[Water Source].[Water Source].&[2],[Water Source].[Water Source].[Water Source].&[3]}"
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
      return simpleAvailableGeoDatumNeed(
        "datum_household_services_heating",
        "casen_household",
        [msrName],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [
            `[Date].[Date].[Year].&[${sources.casen_household.year}]`,
            "{[Heating Energy Source].[Energy Source Survey Response].[Energy Source Survey Response].&[1],[Heating Energy Source].[Energy Source Survey Response].[Energy Source Survey Response].&[2],[Heating Energy Source].[Energy Source Survey Response].[Energy Source Survey Response].&[3],[Heating Energy Source].[Energy Source Survey Response].[Energy Source Survey Response].&[4]}"
          ]
        }
      )(params, store);
    }
  ];

  render() {
    const { children, t, i18n } = this.props;
    const locale = i18n.language;

    const {
      datum_household_services_electr,
      datum_household_services_heating,
      datum_household_services_water,
      datum_household_total,
      geo
    } = this.context.data;

    const area = datum_household_services_electr.available
      ? geo
      : geo.ancestors[0];

    let datum_electr_number, datum_heating_number, datum_water_number;
    let datum_electr_percent, datum_heating_percent, datum_water_percent;
    const datum_housing_total = datum_household_total.data;

    if (datum_housing_total) {
      datum_electr_number = datum_household_services_electr.data[0];
      datum_electr_percent = datum_electr_number / datum_housing_total;

      datum_heating_number = datum_household_services_heating.data[0];
      datum_heating_percent = datum_heating_number / datum_housing_total;

      datum_water_number = datum_household_services_water.data[0];
      datum_water_percent = datum_water_number / datum_housing_total;
    }

    const txt_slide = t("geo_profile.housing.amenities.text");

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Services Access")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="red-electrica"
              datum={
                datum_electr_percent
                  ? numeral(datum_electr_percent, locale).format("(0.0%)")
                  : t("no_datum")
              }
              title={t("Connected to electricity network")}
              subtitle={
                datum_electr_number
                  ? numeral(datum_electr_number, locale).format("(0.0 a)") +
                    t(" in ") +
                    area.caption
                  : ""
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="calefaccion"
              datum={
                datum_heating_percent
                  ? numeral(datum_heating_percent, locale).format("(0.0%)")
                  : t("no_datum")
              }
              title={t("Use fire-based heating")}
              subtitle={
                datum_heating_number
                  ? numeral(datum_heating_number, locale).format("(0.0 a)") +
                    t(" in ") +
                    area.caption
                  : ""
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="agua"
              datum={
                datum_water_percent
                  ? numeral(datum_water_percent, locale).format("(0.0%)")
                  : t("no_datum")
              }
              title={t("Connected to public tap water system")}
              subtitle={
                datum_water_number
                  ? numeral(datum_water_number, locale).format("(0.0 a)") +
                    t(" in ") +
                    area.caption
                  : ""
              }
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(ServicesAccessSlide);
