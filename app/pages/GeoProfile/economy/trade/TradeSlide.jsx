import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { numeral } from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";
import mondrianClient, {
  geoCut,
  simpleDatumNeed
} from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { trade_by_time_and_product } from "helpers/aggregations";

import FeaturedDatum from "components/FeaturedDatum";
import SourceNote from "components/SourceNote";

class TradeSlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed("datum_trade_exports", "exports_and_imports", ["FOB"], {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false },
        cuts: [`[Date].[Date].[Year].&[${sources.exports_and_imports.year}]`]
      })(params, store),
    (params, store) =>
      simpleDatumNeed("datum_trade_imports", "exports_and_imports", ["CIF"], {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false },
        cuts: [`[Date].[Date].[Year].&[${sources.exports_and_imports.year}]`]
      })(params, store),
    (params, store) => {
      const geo = getGeoObject(params);
      const cube = mondrianClient.cube("exports");
      const prm = cube
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .drilldown("Date", "Year")
              .drilldown("Export HS", "HS2")
              .measure("FOB US")
              .measure("Geo Rank Across Time"),
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
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

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { children, t, TradeBalance } = this.props;

    const text_data = this.context.data.text_data_exports_by_product;
    if (text_data) {
      text_data.geo = this.context.data.geo;
      text_data.increased_or_decreased = t(text_data.increased_or_decreased);
    }
    const locale = this.props.i18n.locale;

    const { datum_trade_exports, datum_trade_imports } = this.context.data;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Trade")}</div>
          <div className="topic-slide-text">
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("export_by_product.line1", text_data)
                }}
              />
              <span
                dangerouslySetInnerHTML={{
                  __html: t("export_by_product.line2", text_data)
                }}
              />
              <span
                dangerouslySetInnerHTML={{
                  __html: t("export_by_product.line3", text_data)
                }}
              />
            </p>
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={text_data.trade_volume}
              title={t("Trade volume") + " " + text_data.last_year}
              subtitle={
                <div>
                  <div>
                    {t("Exports") + " "}
                    {numeral(datum_trade_exports, locale).format("($ 0.00 a)")}
                  </div>
                  <div>
                    {t("Imports") + " "}
                    {numeral(datum_trade_imports, locale).format("($ 0.00 a)")}
                  </div>
                </div>
              }
            />
            <TradeBalance className="l-2-3" />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
        <SourceNote cube="exports" />
      </div>
    );
  }
}

export default translate()(TradeSlide);
