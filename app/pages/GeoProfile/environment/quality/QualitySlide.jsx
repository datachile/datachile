import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";
import mondrianClient, {
  geoCut,
  simpleAvailableGeoDatumNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral, slugifyItem } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class QualitySlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";
      return simpleAvailableGeoDatumNeed(
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
      return simpleAvailableGeoDatumNeed(
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
      return simpleAvailableGeoDatumNeed(
        "datum_credit_banco_estado",
        "casen_household",
        [msrName],
        {
          drillDowns: [["Credit", "Credit", "Credit"]],
          options: { parents: false },
          cuts: [
            `[Date].[Date].[Year].&[${sources.casen_household.year}]`,
            "[Credit].[Credit].[Credit].&[2]"
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
    var {
      datum_rural_households,
      datum_less_30mts_sq,
      datum_household_total,
      datum_credit_banco_estado,
      geo
    } = this.context.data;

    const area =
      datum_rural_households && datum_rural_households.available
        ? geo
        : geo.ancestors[0];

    const locale = i18n.locale;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Quality")}</div>
          <div className="topic-slide-text">
            {datum_rural_households &&
              !datum_rural_households.available && (
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("no_info", {
                      yes: area.caption,
                      link: slugifyItem("geo", area.key, area.name),
                      no: geo.caption
                    })
                  }}
                />
              )}
            <p>
              Sed diam. Praesent fermentum tempor tellus. Nullam tempus. Mauris
              ac felis vel velit tristique imperdiet. Donec at pede. Etiam vel
              neque nec dui dignissim bibendum. Vivamus id enim. Phasellus neque
              orci, porta a, aliquet quis, semper a, massa. Phasellus purus.
              Pellentesque tristique imperdiet tortor. Nam euismod tellus id
              erat.
            </p>
          </div>
          <div className="topic-slide-data">
            {datum_rural_households &&
              datum_household_total && (
                <FeaturedDatum
                  className="l-1-3"
                  icon="empleo"
                  datum={
                    datum_rural_households.available
                      ? numeral(datum_rural_households.data, locale).format(
                          "(0.0 a)"
                        )
                      : t("no_datum")
                  }
                  title={t("Rural households")}
                  subtitle={
                    datum_rural_households.available
                      ? numeral(
                          datum_rural_households.data /
                            datum_household_total.data,
                          locale
                        ).format("(0.0%)") +
                        t(" of ") +
                        area.caption
                      : ""
                  }
                />
              )}
            {datum_less_30mts_sq &&
              datum_household_total && (
                <FeaturedDatum
                  className="l-1-3"
                  icon="empleo"
                  datum={
                    datum_less_30mts_sq.available
                      ? numeral(datum_less_30mts_sq.data, locale).format(
                          "(0.0 a)"
                        )
                      : t("no_datum")
                  }
                  title={t("Less than 30 square meter households")}
                  subtitle={
                    datum_less_30mts_sq.available
                      ? numeral(
                          datum_less_30mts_sq.data / datum_household_total.data,
                          locale
                        ).format("(0.0%)") +
                        t(" of ") +
                        area.caption
                      : ""
                  }
                />
              )}
            {datum_credit_banco_estado &&
              datum_household_total && (
                <FeaturedDatum
                  className="l-1-3"
                  icon="empleo"
                  datum={
                    datum_credit_banco_estado.available
                      ? numeral(datum_credit_banco_estado.data, locale).format(
                          "(0.0 a)"
                        )
                      : t("no_datum")
                  }
                  title={t("Households with credit in state bank")}
                  subtitle={
                    datum_credit_banco_estado.available
                      ? numeral(
                          datum_credit_banco_estado.data /
                            datum_household_total.data,
                          locale
                        ).format("(0.0%)") +
                        t(" of ") +
                        area.caption
                      : ""
                  }
                />
              )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(QualitySlide);
