import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import flattenDeep from "lodash/flattenDeep";

import { sources } from "helpers/consts";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import { calculateYearlyGrowth } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

import { trade_balance_text } from "helpers/aggregations";

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
      datum_product_export_growth
    } = this.context.data;
    const locale = i18n.locale;

    const text_product = {
      product: this.context.data.product,
      year: {
        number: 2015 - 2002,
        first: 2002,
        last: 2015
      },
      exports: trade_balance_text(datum_product_export_growth),
      imports: trade_balance_text(datum_product_import_growth)
    };

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
              icon="empleo"
              datum={text_product.exports.growth_rate}
              title={t("Growth Exports")}
              subtitle={
                t("In period") +
                " " +
                2002 +
                "-" +
                sources.exports_and_imports.year
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={text_product.imports.growth_rate}
              title={t("Growth Imports")}
              subtitle={
                t("In period") +
                " " +
                2002 +
                "-" +
                sources.exports_and_imports.year
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={"4343k"}
              title={t("Trade volume")}
              subtitle="XXXX - YYYY"
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternationalTradeSlide);
