import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import maxBy from "lodash/maxBy";
import sumBy from "lodash/sumBy";
import flattenDeep from "lodash/flattenDeep";

import FeaturedDatum from "components/FeaturedDatum";

import { simpleCountryDatumNeed, quickQuery } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { numeral, buildPermalink } from "helpers/formatters";

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
              link: buildPermalink(max, "products")
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
              link: buildPermalink(max, "products")
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

    const country = this.context.data.country;
    const trade_import = this.context.data.datum_trade_import || {};
    const trade_export = this.context.data.datum_trade_export || {};

    const import_volume = trade_import.total || 0;
    const export_volume = trade_export.total || 0;
    const balance_volume = export_volume - import_volume;

    const txt_slide = t("country_profile.intltrade_slide.text", {
      level: country.caption,
      year: last_year,
      context: balance_volume == 0 ? "none" : "",
      total_imports: numeral(import_volume, locale).format("($0.00a)"),
      total_exports: numeral(export_volume, locale).format("($0.00a)"),
      total_balance: numeral(Math.abs(balance_volume), locale).format(
        "($0,.00a)"
      ),
      behavior: balance_volume > 0 ? t("positive") : t("negative"),
      main_import: trade_import,
      main_export: trade_export
    });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Imports & Exports")}</div>
          <p
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />

          <div className="topic-slide-data">
            {trade_import.name && (
              <FeaturedDatum
                className="l-1-2"
                icon="principal-producto-importado"
                datum={trade_import.name}
                title={t("Main imported product")}
                subtitle={`${trade_import.percent} - ${last_year}`}
              />
            )}
            {trade_export.name && (
              <FeaturedDatum
                className="l-1-2"
                icon="principal-producto-exportado"
                datum={trade_export.name}
                title={t("Main exported product")}
                subtitle={`${trade_export.percent} - ${last_year}`}
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
