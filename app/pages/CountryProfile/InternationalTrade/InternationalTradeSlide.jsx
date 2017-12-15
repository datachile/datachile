import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import maxBy from "lodash/maxBy";
import sumBy from "lodash/sumBy";

import FeaturedDatum from "components/FeaturedDatum";

import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

const last_year = sources.exports_and_imports.year;

class InternationalTradeSlide extends Section {
  static need = [
    function datumImportsNeed(params, store) {
      const lang = store.i18n.locale;

      const level1 = (params.level1 || "").split("-").pop();
      const level2 = (params.level2 || "").split("-").pop();

      const geoCut = level2
        ? `[Country].&[${level2}]`
        : `[Subregion].&[${level1}]`;

      const promise = mondrianClient
        .cube("imports")
        .then(cube => {
          const query = cube.query
            .drilldown("Import HS", "HS", "HS2")
            .cut(`[Date].[Date].[Year].&[${sources.exports_and_imports.year}]`)
            .cut(`[Country].[Country].${geoCut}`)
            .measure("CIF US")
            .option("parents", false);

          setLangCaptions(query, lang);

          return mondrianClient.query(query, "jsonrecords");
        })
        .then(res => {
          const max = maxBy(res.data.data, "CIF US");
          const total = sumBy(res.data.data, "CIF US");
          return {
            key: "datum_trade_import",
            data: {
              max,
              year: sources.exports_and_imports.year,
              percentage: numeral(max["CIF US"] / total, lang).format("0.0%")
            }
          };
        });

      return {
        type: "GET_DATA",
        promise
      };
    },
    function datumExportsNeed(params, store) {
      const lang = store.i18n.locale;

      const level1 = (params.level1 || "").split("-").pop();
      const level2 = (params.level2 || "").split("-").pop();

      const geoCut = level2
        ? `[Country].&[${level2}]`
        : `[Subregion].&[${level1}]`;

      const promise = mondrianClient
        .cube("exports")
        .then(cube => {
          const query = cube.query
            .drilldown("Export HS", "HS", "HS2")
            .cut(`[Date].[Date].[Year].&[${sources.exports_and_imports.year}]`)
            .cut(`[Country].[Country].${geoCut}`)
            .measure("FOB US")
            .option("parents", false);

          setLangCaptions(query, lang);

          return mondrianClient.query(query, "jsonrecords");
        })
        .then(res => {
          const max = maxBy(res.data.data, "FOB US");
          const total = sumBy(res.data.data, "FOB US");
          return {
            key: "datum_trade_export",
            data: {
              max,
              year: sources.exports_and_imports.year,
              percentage: numeral(max["FOB US"] / total, lang).format("0.0%")
            }
          };
        });

      return {
        type: "GET_DATA",
        promise
      };
    }
  ];

  render() {
    const { children, t } = this.props;

    const {
      country,
      datum_trade_import,
      datum_trade_export
    } = this.context.data;

    const txt_slide = t("country_profile.intltrade_slide.text", {
      level: country.caption,
      year_latest: last_year,
      main_import: {
        name: "name".toUpperCase(),
        local_percent: "local_percent".toUpperCase(),
        global_percent: "global_percent".toUpperCase(),
        total_percent: "total_percent".toUpperCase()
      },
      main_export: {
        name: "name".toUpperCase(),
        local_percent: "local_percent".toUpperCase(),
        global_percent: "global_percent".toUpperCase(),
        total_percent: "total_percent".toUpperCase()
      }
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
            <FeaturedDatum
              className="l-1-2"
              icon="product-import"
              datum={datum_trade_import.max["HS2"]}
              title={t("Main imported product")}
              subtitle={`${datum_trade_import.percentage} - ${
                datum_trade_import.year
              }`}
            />
            <FeaturedDatum
              className="l-1-2"
              icon="product-export"
              datum={datum_trade_export.max["HS2"]}
              title={t("Main exported product")}
              subtitle={`${datum_trade_export.percentage} - ${
                datum_trade_export.year
              }`}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternationalTradeSlide);
