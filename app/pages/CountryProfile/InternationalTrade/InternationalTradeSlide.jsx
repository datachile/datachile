import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import maxBy from "lodash/maxBy";
import sumBy from "lodash/sumBy";
import flattenDeep from "lodash/flattenDeep";

import FeaturedDatum from "components/FeaturedDatum";

import { simpleCountryDatumNeed, quickQuery } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { numeral, slugifyItem } from "helpers/formatters";

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
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, lang) => {
        const data = result.data.data;

        const total = sumBy(data, "CIF US");
        const max = maxBy(data, "CIF US");

        return max
          ? {
              name: max["HS2"],
              amount: max["FOB US"],
              total: total,
              percent: numeral(max["CIF US"] / total, lang).format("0.0%"),
              link: slugifyItem(
                "products",
                max["ID HS0"],
                max["HS0"],
                max["ID HS2"],
                max["HS2"]
              )
            }
          : {
              name: null,
              amount: 0,
              total: total,
              percent: numeral(0, lang).format("0.0%"),
              link: ""
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
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, lang) => {
        const data = result.data.data;

        const total = sumBy(data, "FOB US");
        const max = maxBy(data, "FOB US");

        return max
          ? {
              name: max["HS2"],
              amount: max["FOB US"],
              total: total,
              percent: numeral(max["FOB US"] / total, lang).format("0.0%"),
              link: slugifyItem(
                "products",
                max["ID HS0"],
                max["HS0"],
                max["ID HS2"],
                max["HS2"]
              )
            }
          : {
              name: null,
              amount: 0,
              total: total,
              percent: numeral(0, lang).format("0.0%"),
              link: ""
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

    const import_volume = datum_trade_import.total;
    const export_volume = datum_trade_export.total;
    const balance_volume = export_volume - import_volume;

    const txt_slide = t("country_profile.intltrade_slide.text", {
      level: country.caption,
      year: last_year,
      total_imports: numeral(import_volume, locale).format("($ 0.00 a)"),
      total_exports: numeral(export_volume, locale).format("($ 0.00 a)"),
      total_balance: numeral(Math.abs(balance_volume), locale).format(
        "($ 0.00 a)"
      ),
      behavior: balance_volume > 0 ? t("positive") : t("negative"),
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
                icon="principal-producto-importado"
                datum={datum_trade_import.name}
                title={t("Main imported product")}
                subtitle={`${datum_trade_import.percent} - ${last_year}`}
              />
            )}
            {datum_trade_export.name && (
              <FeaturedDatum
                className="l-1-2"
                icon="principal-producto-exportado"
                datum={datum_trade_export.name}
                title={t("Main exported product")}
                subtitle={`${datum_trade_export.percent} - ${last_year}`}
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
