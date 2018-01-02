import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import maxBy from "lodash/maxBy";
import sumBy from "lodash/sumBy";
import flattenDeep from "lodash/flattenDeep";

import FeaturedDatum from "components/FeaturedDatum";

import {
  simpleCountryDatumNeed,
  quickQuery
} from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

const last_year = sources.exports_and_imports.year;

class InternationalTradeSlide extends Section {
  static need = [
    simpleCountryDatumNeed(
      "datum_trade_import",
      {
        cube: "imports",
        measures: ["CIF US"],
        drillDowns: [["Import HS", "HS", "HS2"]],
        cuts: [`[Date].[Date].[Year].&[${last_year}]`],
        options: { parents: false },
        format: "jsonrecords"
      },
      (result, lang) => {
        const data = result.data.data;

        const total = sumBy(data, "CIF US");
        const max = maxBy(data, "CIF US");

        return max
          ? quickQuery({
              cube: "imports",
              measures: ["CIF US"],
              drillDowns: [["Import HS", "HS", "HS2"]],
              cuts: [
                `[Date].[Date].[Year].&[${last_year}]`,
                `[Import HS].[HS].[HS2].&[${max["ID HS2"]}]`
              ],
              options: { parents: false },
              locale: lang
            }).then(res => {
              const value = flattenDeep(res.data.values)[0];
              return {
                name: max["HS2"],
                amount: max["FOB US"],
                local_percent: numeral(max["CIF US"] / total, lang).format(
                  "0.0%"
                ),
                global_percent: numeral(max["CIF US"] / value, lang).format(
                  "0.0%"
                )
              };
            })
          : {
              name: null,
              amount: 0,
              local_percent: numeral(0, lang).format("0.0%"),
              global_percent: numeral(0, lang).format("0.0%")
            };
      }
    ),

    simpleCountryDatumNeed(
      "datum_trade_export",
      {
        cube: "exports",
        measures: ["FOB US"],
        drillDowns: [["Export HS", "HS", "HS2"]],
        cuts: [`[Date].[Date].[Year].&[${last_year}]`],
        options: { parents: false },
        format: "jsonrecords"
      },
      (result, lang) => {
        const data = result.data.data;

        const total = sumBy(data, "FOB US");
        const max = maxBy(data, "FOB US");

        return max
          ? quickQuery({
              cube: "exports",
              measures: ["FOB US"],
              drillDowns: [["Export HS", "HS", "HS2"]],
              cuts: [
                `[Date].[Date].[Year].&[${last_year}]`,
                `[Export HS].[HS].[HS2].&[${max["ID HS2"]}]`
              ],
              options: { parents: false },
              locale: lang
            }).then(res => {
              const value = flattenDeep(res.data.values)[0];
              return {
                name: max["HS2"],
                amount: max["FOB US"],
                local_percent: numeral(max["FOB US"] / total, lang).format(
                  "0.0%"
                ),
                global_percent: numeral(max["FOB US"] / value, lang).format(
                  "0.0%"
                )
              };
            })
          : {
              name: null,
              amount: 0,
              local_percent: numeral(0, lang).format("0.0%"),
              global_percent: numeral(0, lang).format("0.0%")
            };
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const locale = i18n.language;

    const {
      country,
      datum_trade_import,
      datum_trade_export
    } = this.context.data;

    const context =
      (datum_trade_import.name ? 1 : 0) ^ (datum_trade_export.name ? 2 : 0);

    const txt_slide = t("country_profile.intltrade_slide.text", {
      level: country.caption,
      year: last_year,
      context: context.toString(),
      main_import: datum_trade_import,
      main_export: datum_trade_export
    });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Imports & Exports")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />

          <div className="topic-slide-data">
            {datum_trade_import.name && (
              <FeaturedDatum
                className="l-1-2"
                icon="product-import"
                datum={datum_trade_import.name}
                title={t("Main imported product")}
                subtitle={`${datum_trade_import.local_percent} - ${last_year}`}
              />
            )}
            {datum_trade_export.name && (
              <FeaturedDatum
                className="l-1-2"
                icon="product-export"
                datum={datum_trade_export.name}
                title={t("Main exported product")}
                subtitle={`${datum_trade_export.local_percent} - ${last_year}`}
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternationalTradeSlide);
