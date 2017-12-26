import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import flattenDeep from "lodash/flattenDeep";

import { sources } from "helpers/consts";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import { numeral } from "helpers/formatters";

import { InternationalTradeBalance } from "texts/ProductProfile";

import FeaturedDatum from "components/FeaturedDatum";

class InternationalTradeSlide extends Section {
  static need = [
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient
        .cube("exports")
        .then(cube => {
          var q = levelCut(
            product,
            "Export HS",
            "HS",
            cube.query
              .option("parents", false)
              .drilldown("Date", "Date", "Year")
              .measure("FOB US"),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          return mondrianClient.query(q);
        })
        .then(res => {
          return {
            key: "datum_product_export_growth",
            data: flattenDeep(res.data.values)
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient
        .cube("imports")
        .then(cube => {
          var q = levelCut(
            product,
            "Import HS",
            "HS",
            cube.query
              .option("parents", false)
              .drilldown("Date", "Date", "Year")
              .measure("CIF US"),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          return mondrianClient.query(q);
        })
        .then(res => {
          return {
            key: "datum_product_import_growth",
            data: flattenDeep(res.data.values)
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { t, children, i18n } = this.props;
    const {
      datum_product_import_growth,
      datum_product_export_growth,
      total_exports_chile,
      total_exports_per_product,
      product
    } = this.context.data;
    const locale = i18n.locale;

    const text_product = InternationalTradeBalance(
      product,
      datum_product_export_growth,
      datum_product_import_growth
    );

    const exports_size = total_exports_per_product
      ? total_exports_per_product.value / total_exports_chile
      : 0;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">
            {t("International Trade Balance")}
          </div>
          <div className="topic-slide-text">
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("product_profile.balance", text_product)
                }}
              />
            </p>
          </div>

          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="product-export"
              datum={text_product.exports.growth_rate}
              title={t("Annual Growth Exports")}
              subtitle={
                t("In period") +
                " " +
                sources.exports_and_imports.min_year +
                "-" +
                sources.exports_and_imports.year
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="product-import"
              datum={text_product.imports.growth_rate}
              title={t("Annual Growth Imports")}
              subtitle={
                t("In period") +
                " " +
                sources.exports_and_imports.min_year +
                "-" +
                sources.exports_and_imports.year
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(exports_size, locale).format("(0.0 %)")}
              title={t("Trade volume")}
              subtitle="In 2015"
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternationalTradeSlide);
