import React from "react";
import { translate } from "react-i18next";
import { Section, SectionColumns } from "datawheel-canon";
import { numeral } from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";
import mondrianClient, {
  geoCut,
  simpleGeoDatumNeed
} from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { trade_by_time_and_product } from "helpers/aggregations";

import FeaturedDatum from "components/FeaturedDatum";
import isEmpty from "lodash/isEmpty";

class TradeSlide extends Section {
  static need = [
    (params, store) =>
      simpleGeoDatumNeed(
        "datum_trade_exports",
        "exports_and_imports",
        ["FOB"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${sources.exports_and_imports.year}]`]
        }
      )(params, store),
    (params, store) =>
      simpleGeoDatumNeed(
        "datum_trade_imports",
        "exports_and_imports",
        ["CIF"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${sources.exports_and_imports.year}]`]
        }
      )(params, store),
    (params, store) => {
      const geo = getGeoObject(params);
      const promise = mondrianClient
        .cube("exports")
        .then(cube => {
          var q = cube.query
            .option("parents", true)
            .drilldown("Date", "Year")
            .drilldown("Export HS", "HS2")
            .measure("FOB US")
            .measure("Geo Rank Across Time");

          return mondrianClient.query(
            geoCut(geo, "Geography", q, store.i18n.locale),
            "jsonrecords"
          );
        })
        .then(res => {
          const result = trade_by_time_and_product(
            res.data.data,
            "FOB US",
            geo.type != "country",
            store.i18n.locale
          );
          return {
            key: "text_data_exports_by_product",
            data: result
          };
        });

      return { type: "GET_DATA", promise };
    },
    (params, store) => {
      const geo = getGeoObject(params);
      const promise = mondrianClient
        .cube("imports")
        .then(cube => {
          var q = cube.query
            .option("parents", true)
            .drilldown("Date", "Year")
            .drilldown("Import HS", "HS2")
            .measure("CIF US")
            .measure("Geo Rank Across Time");

          return mondrianClient.query(
            geoCut(geo, "Geography", q, store.i18n.locale),
            "jsonrecords"
          );
        })
        .then(res => {
          const result = trade_by_time_and_product(
            res.data.data,
            "CIF US",
            geo.type != "country",
            store.i18n.locale
          );
          return {
            key: "text_data_imports_by_product",
            data: result
          };
        });

      return { type: "GET_DATA", promise };
    }
  ];

  render() {
    const { children, t, TradeBalance } = this.props;

    let text_data = {
      exports: this.context.data.text_data_exports_by_product,
      imports: this.context.data.text_data_imports_by_product
    };

    text_data.geo = this.context.data.geo;

    if ("trade_volume" in text_data.exports) {
      text_data.exports.increased_or_decreased = text_data.exports.increased
        ? t("increased")
        : t("decreased");
    }
    if ("trade_volume" in text_data.imports) {
      text_data.imports.increased_or_decreased = text_data.imports.increased
        ? t("increased")
        : t("decreased");
    }

    const locale = this.props.i18n.language;

    const { datum_trade_exports, datum_trade_imports } = this.context.data;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title">{t("Trade")}</h3>
          <div className="topic-slide-text">
            <p
              dangerouslySetInnerHTML={{
                __html: !("trade_volume" in text_data.exports)
                  ? t("geo_profile.economy.exports.no_data", text_data)
                  : text_data.exports.trade_first_share === "100%"
                    ? t("geo_profile.economy.exports.one", text_data)
                    : t("geo_profile.economy.exports.default", text_data)
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: !("trade_volume" in text_data.imports)
                  ? t("geo_profile.economy.imports.no_data", text_data)
                  : text_data.imports.trade_first_share === "100%"
                    ? t("geo_profile.economy.imports.one", text_data)
                    : t("geo_profile.economy.imports.default", text_data)
              }}
            />
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="exportaciones"
              datum={
                "US " + numeral(datum_trade_exports, locale).format("($0.00a)")
              }
              title={t("Exports {{last_year}}", {
                last_year: sources.exports.year
              })}
              subtitle={
                t("Imports") +
                ": " +
                t("US{{imports}}", {
                  imports: numeral(datum_trade_imports, locale).format(
                    "($0,.00a)"
                  )
                })
              }
            />
          </div>
        </div>
        <div className="topic-slide-charts">
          {TradeBalance
            ? <TradeBalance className="trade-balance-container lost-1" />
            : children
          }
        </div>
      </div>
    );
  }
}

try {
  window.debugComponent = TradeSlide.need;
} catch (e) {
  ("pass");
}

export default translate()(TradeSlide);
