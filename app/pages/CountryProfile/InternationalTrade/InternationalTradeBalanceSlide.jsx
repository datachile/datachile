import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import FeaturedDatum from "components/FeaturedDatum";

import mondrianClient, { simpleCountryDatumNeed } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { accumulated_growth } from "helpers/aggregations";
import { numeral } from "helpers/formatters";

class InternationalTradeBalanceSlide extends Section {
  static need = [
    simpleCountryDatumNeed("datum_country_imports_per_year", {
      cube: "imports",
      measures: ["CIF US"],
      drillDowns: [["Date", "Date", "Year"]],
      options: { parents: false }
    }),

    simpleCountryDatumNeed("datum_country_exports_per_year", {
      cube: "exports",
      measures: ["FOB US"],
      drillDowns: [["Date", "Date", "Year"]],
      options: { parents: false }
    }),

    simpleCountryDatumNeed("datum_global_exports_last_year", {
      cube: "exports",
      measures: ["FOB US"],
      drillDowns: [["Date", "Date", "Year"]],
      cuts: [`[Date].[Date].[Year].&[${sources.exports.year}]`],
      options: { parents: false }
    })
  ];

  direction(a, t) {
    return a[0] < a[a.length - 1] ? t("an increase") : t("a decrease");
  }

  render() {
    const { t, children, i18n } = this.props;
    const locale = i18n.language;

    const {
      country,
      // both datum_trade_ are requested on InternationalTradeSlide
      datum_trade_export,
      datum_trade_import,
      datum_country_imports_per_year,
      datum_country_exports_per_year,
      datum_global_exports_last_year
    } = this.context.data;

    const growth_export = accumulated_growth(
      datum_country_exports_per_year,
      locale
    );
    const growth_import = accumulated_growth(
      datum_country_imports_per_year,
      locale
    );

    const import_volume_last =
      datum_country_imports_per_year[datum_country_imports_per_year.length - 1];
    const export_volume_last =
      datum_country_exports_per_year[datum_country_exports_per_year.length - 1];

    const txt_slide = t("country_profile.intltrade_balance_slide.text", {
      level: country.caption,
      year: {
        first: sources.exports.min_year,
        last: sources.exports.year
      },
      import: {
        growth: growth_import,
        direction: this.direction(datum_country_imports_per_year, t),
        volume_first: numeral(datum_country_imports_per_year[0], locale).format(
          "($ 0.00 a)"
        ),
        volume_last: numeral(import_volume_last, locale).format("($ 0.00 a)")
      },
      export: {
        growth: growth_export,
        direction: this.direction(datum_country_exports_per_year, t),
        volume_first: numeral(datum_country_exports_per_year[0], locale).format(
          "($ 0.00 a)"
        ),
        volume_last: numeral(export_volume_last, locale).format("($ 0.00 a)")
      }
    });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">
            {t("International Trade Balance")}
          </div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />

          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="product-import"
              datum={growth_import}
              title={t("Growth Imports")}
              subtitle={t("In period {{year_first}} - {{year_last}}", {
                year_first: sources.imports.min_year,
                year_last: sources.imports.year
              })}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="product-export"
              datum={growth_export}
              title={t("Growth Exports")}
              subtitle={t("In period {{year_first}} - {{year_last}}", {
                year_first: sources.exports.min_year,
                year_last: sources.exports.year
              })}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(
                export_volume_last / datum_global_exports_last_year[0],
                locale
              ).format("0.0%")}
              title={t("Exports volume")}
              subtitle={t(
                "relative to exports to the world in {{year}}",
                sources.exports
              )}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternationalTradeBalanceSlide);
