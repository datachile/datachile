import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import maxBy from "lodash/maxBy";
import sumBy from "lodash/sumBy";
import flattenDeep from "lodash/flattenDeep";

import FeaturedDatum from "components/FeaturedDatum";

import mondrianClient, { simpleCountryDatumNeed } from "helpers/MondrianClient";
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
        const percentage = numeral(max["CIF US"] / total, lang).format("0.0%");

        return mondrianClient
          .cube("imports")
          .then(cube =>
            mondrianClient.query(
              cube.query
                .drilldown("Import HS", "HS", "HS2")
                .cut(`[Date].[Date].[Year].&[${last_year}]`)
                .cut(`[Import HS].[HS].[HS2].&[${max["ID HS2"]}]`)
                .measure("CIF US")
                .option("parents", false)
            )
          )
          .then(res => ({
            local: { max, percentage },
            global: flattenDeep(res.data.values),
            total_lastyear: total
          }));
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
        const percentage = numeral(max["FOB US"] / total, lang).format("0.0%");

        return mondrianClient
          .cube("exports")
          .then(cube =>
            mondrianClient.query(
              cube.query
                .drilldown("Export HS", "HS", "HS2")
                .cut(`[Date].[Date].[Year].&[${last_year}]`)
                .cut(`[Export HS].[HS].[HS2].&[${max["ID HS2"]}]`)
                .measure("FOB US")
                .option("parents", false)
            )
          )
          .then(res => ({
            local: { max, percentage },
            global: flattenDeep(res.data.values),
            total_lastyear: total
          }));
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

    const import_local = datum_trade_import.local;
    const export_local = datum_trade_export.local;

    var txt_slide = "";
    if (import_local.max && export_local.max) {
      txt_slide = t("country_profile.intltrade_slide.text", {
        level: country.caption,
        year_last: last_year,
        main_import: {
          name: import_local.max["HS2"],
          local_percent: import_local.percentage,
          global_percent: numeral(
            import_local.max["CIF US"] / datum_trade_import.global[0],
            locale
          ).format("0.0%")
        },
        main_export: {
          name: export_local.max["HS2"],
          local_percent: export_local.percentage,
          global_percent: numeral(
            export_local.max["FOB US"] / datum_trade_export.global[0],
            locale
          ).format("0.0%")
        }
      });
    }

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Imports & Exports")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />

          <div className="topic-slide-data">
            {import_local &&
              import_local.max && (
                <FeaturedDatum
                  className="l-1-2"
                  icon="product-import"
                  datum={import_local.max["HS2"]}
                  title={t("Main imported product")}
                  subtitle={`${import_local.percentage} - ${last_year}`}
                />
              )}

            {export_local &&
              export_local.max && (
                <FeaturedDatum
                  className="l-1-2"
                  icon="product-export"
                  datum={export_local.max["HS2"]}
                  title={t("Main exported product")}
                  subtitle={`${export_local.percentage} - ${last_year}`}
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
