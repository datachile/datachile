import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import { sources } from "helpers/consts";
import { simpleDatumNeed } from "helpers/MondrianClient";
import { joinDataByYear } from "helpers/dataUtils";

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
        "product.export",
        false
      )(params, store),
    (params, store) =>
      simpleDatumNeed(
        "datum_imports_by_year",
        "imports",
        ["CIF US"],
        { drillDowns: [["Date", "Date", "Year"]], options: { parents: true } },
        "product.import",
        false
      )(params, store)
  ];

  render() {
    const { t, children, i18n } = this.props;
    let {
      datum_exports_by_year,
      datum_imports_by_year,
      total_exports_chile,
      total_exports_per_product,
      product
    } = this.context.data;
    const locale = i18n.language;

    datum_exports_by_year = joinDataByYear(
      datum_exports_by_year,
      "FOB US",
      sources.exports.min_year,
      sources.exports.year
    );
    datum_imports_by_year = joinDataByYear(
      datum_imports_by_year,
      "CIF US",
      sources.exports.min_year,
      sources.exports.year
    );

    const text_product = InternationalTradeBalance(
      product,
      datum_exports_by_year,
      datum_imports_by_year,
      t
    );

    const trade_balance =
      datum_exports_by_year[datum_exports_by_year.length - 1] -
      datum_imports_by_year[datum_imports_by_year.length - 1];

    const exports_size = total_exports_per_product
      ? total_exports_per_product.value / total_exports_chile
      : 0;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("International Trade Balance")}
          </h3>
          <div className="topic-slide-text">
            <p
              dangerouslySetInnerHTML={{
                __html: t(
                  `product_profile.balance.${text_product.format}`,
                  text_product
                )
              }}
            />
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
              icon="ingresos"
              datum={"US " + numeral(trade_balance, locale).format("$0,,0.00 a")}
              title={t("Trade Balance")}
              subtitle={t("In") + " " + sources.imports.year}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(InternationalTradeBalanceSlide);
