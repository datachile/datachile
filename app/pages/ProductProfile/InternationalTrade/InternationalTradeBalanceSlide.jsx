import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";
import { simpleDatumNeed } from "helpers/MondrianClient";

import { numeral } from "helpers/formatters";

import { InternationalTradeBalance } from "texts/ProductProfile";

import FeaturedDatum from "components/FeaturedDatum";

class InternationalTradeBalanceSlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "datum_exports_by_year",
        "exports",
        ["FOB US"],
        { drillDowns: [["Date", "Date", "Year"]], options: { parents: true } },
        "product.export"
      )(params, store),
    (params, store) =>
      simpleDatumNeed(
        "datum_imports_by_year",
        "imports",
        ["CIF US"],
        { drillDowns: [["Date", "Date", "Year"]], options: { parents: true } },
        "product.import"
      )(params, store)
  ];

  render() {
    const { t, children, i18n } = this.props;
    const {
      datum_exports_by_year,
      datum_imports_by_year,
      total_exports_chile,
      total_exports_per_product,
      product
    } = this.context.data;
    const locale = i18n.locale;

    const text_product = InternationalTradeBalance(
      product,
      datum_exports_by_year,
      datum_imports_by_year,
      t
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
                  __html: t(
                    `product_profile.balance.${text_product.format}`,
                    text_product
                  )
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
                sources.exports.min_year +
                "-" +
                sources.exports.year
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
                sources.imports.min_year +
                "-" +
                sources.imports.year
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

export default translate()(InternationalTradeBalanceSlide);
