import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import { sources } from "helpers/consts";
import mondrianClient, {
  geoCut,
  simpleAvailableGeoDatumNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral, slugifyItem } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

const groupSumBy = (array, key_group, key_sum) => {
  return array.reduce((sum, item) => {
    const key = item[key_group];
    sum[key] = (sum[key] || 0) + (parseFloat(item[key_sum]) || 0);
    return sum;
  }, {});
};

class QualitySlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";
      return simpleAvailableGeoDatumNeed(
        "datum_household_zone_rural",
        "casen_household",
        [msrName],
        {
          drillDowns: [["Date", "Date", "Year"]],
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
    },
    (params, store) => {
      const geo = getGeoObject(params);

      const promise = mondrianClient
        .cube("casen_household")
        .then(cube => {
          const query = cube.query
            .drilldown("Household Type", "Household Type", "Household Type")
            .drilldown("Walls Material", "Walls Material", "Walls Material")
            .measure("Expansion Factor Region")
            .option("parents", false);

          if (geo.type == "comuna") query.measure("Expansion Factor Comuna");

          return mondrianClient.query(
            geoCut(geo, "Geography", query, store.i18n.locale),
            "jsonrecords"
          );
        })
        .then(result => {
          const data = result.data.data;

          const is_comuna = data.some(d => d["Expansion Factor Comuna"]);
          const labels = data.reduce(
            (list, d) => {
              d["Expansion Factor"] =
                (is_comuna
                  ? d["Expansion Factor Comuna"]
                  : d["Expansion Factor Region"]) || 0;
              const key_material = d["ID Walls Material"];
              const key_type = d["ID Household Type"];
              list.material[key_material] = d["Walls Material"];
              list.type[key_type] = d["Household Type"];
              return list;
            },
            { material: {}, type: {} }
          );

          const by_material = groupSumBy(
            data,
            "ID Walls Material",
            "Expansion Factor"
          );
          const by_type = groupSumBy(
            data,
            "ID Household Type",
            "Expansion Factor"
          );

          const max_material = Object.keys(by_material)
            .sort((a, b) => by_material[a] - by_material[b])
            .pop();
          const max_type = Object.keys(by_type)
            .sort((a, b) => by_type[a] - by_type[b])
            .pop();

          return {
            key: "datum_household_quality",
            data: {
              type: labels.type[max_type],
              type_number: by_type[max_type],
              material: labels.material[max_material],
              material_number: by_material[max_material]
            }
          };
        });

      return { type: "GET_DATA", promise };
    }
  ];

  render() {
    const { children, t, i18n } = this.props;
    const locale = i18n.language;
    var {
      datum_household_quality,
      datum_household_zone_rural,
      datum_less_30mts_sq,
      datum_household_total,
      datum_credit_banco_estado,
      geo
    } = this.context.data;

    const area =
      datum_household_zone_rural && datum_household_zone_rural.available
        ? geo
        : geo.ancestors[0];

    const rural_number = datum_household_zone_rural.data[0];
    const rural_percent = rural_number / datum_household_total.data;

    const bitwise_context = (
      (rural_number ? 1 : 0) ^
      (datum_household_quality.type_number &&
      datum_household_quality.material_number
        ? 2
        : 0)
    ).toString();
    const txt_slide = t("geo_profile.housing.quality.text", {
      context: bitwise_context,
      level: geo.name,
      housing_rural_number: rural_number,
      housing_rural_percent: numeral(rural_percent, locale).format("(0.0%)"),
      housing_common_type: datum_household_quality.type,
      housing_common_material: datum_household_quality.material
    });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">{t("Quality")}</h3>
          <p
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            {datum_household_zone_rural &&
              datum_household_total && (
                <FeaturedDatum
                  className="l-1-3"
                  icon="hogares-rurales"
                  datum={
                    datum_household_zone_rural.available
                      ? numeral(rural_number, locale).format("(0.0a)")
                      : t("no_datum")
                  }
                  title={t("Rural households")}
                  subtitle={
                    datum_household_zone_rural.available
                      ? numeral(rural_percent, locale).format("(0.0%)") +
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
                  icon="tamano-vivienda"
                  datum={
                    datum_less_30mts_sq.available
                      ? numeral(datum_less_30mts_sq.data, locale).format(
                          "(0.0a)"
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
                  icon="vivienda-credito"
                  datum={
                    datum_credit_banco_estado.available
                      ? numeral(datum_credit_banco_estado.data, locale).format(
                          "(0.0a)"
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
