import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import FeaturedDatum from "components/FeaturedDatum";

import { simpleCountryDatumNeed, quickQuery } from "helpers/MondrianClient";
import { annualized_growth } from "helpers/calculator";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

class InternationalTradeBalanceSlide extends Section {
  static need = [
    simpleCountryDatumNeed("datum_country_yearly_imports", {
      cube: "imports",
      measures: ["CIF US"],
      drillDowns: [["Date", "Date", "Year"]],
      options: { parents: false }
    }),

    simpleCountryDatumNeed("datum_country_yearly_exports", {
      cube: "exports",
      measures: ["FOB US"],
      drillDowns: [["Date", "Date", "Year"]],
      options: { parents: false }
    }),

    (params, store) => {
      // this need isn't cut by region/country
      return {
        type: "GET_DATA",
        promise: quickQuery({
          cube: "exports",
          measures: ["FOB US"],
          drillDowns: [["Date", "Date", "Year"]],
          cuts: [`[Date].[Date].[Year].&[${sources.exports.year}]`],
          options: { parents: false },
          locale: store.i18n.locale
        }).then(result => ({
          key: "datum_global_exports_last_year",
          data: result.data.values[0]
        }))
      };
    }
  ];

  getBalanceContext(imp, exp, balance) {
    if (balance == 0) return "none";
    else if (!imp) return "exponly";
    else if (!exp) return "imponly";
    else return "";
  }

  render() {
    const { t, children, i18n } = this.props;
    const locale = i18n.language;

    const country = this.context.data.country;
    // both datum_trade_ are requested on InternationalTradeSlide
    const trade_export = this.context.data.datum_trade_export || [];
    const trade_import = this.context.data.datum_trade_import || [];
    const country_yearly_imports =
      this.context.data.datum_country_yearly_imports || [];
    const country_yearly_exports =
      this.context.data.datum_country_yearly_exports || [];
    const global_exports_last_year =
      this.context.data.datum_global_exports_last_year || [];

    const growth_import = annualized_growth(country_yearly_imports, [
      sources.exports.min_year,
      sources.exports.year
    ]);
    const growth_export = annualized_growth(country_yearly_exports, [
      sources.exports.min_year,
      sources.exports.year
    ]);

    const import_volume_first = country_yearly_imports[0];
    const export_volume_first = country_yearly_exports[0];
    const import_volume_last =
      country_yearly_imports[country_yearly_imports.length - 1];
    const export_volume_last =
      country_yearly_exports[country_yearly_exports.length - 1];
    const balance_volume_last = export_volume_last - import_volume_last;

    const txt_slide = t("country_profile.intltrade_balance_slide.text", {
      level: country.caption,
      year: {
        first: sources.exports.min_year,
        last: sources.exports.year
      },
      context: this.getBalanceContext(
        growth_import,
        growth_export,
        balance_volume_last
      ),
      import: {
        behavior:
          import_volume_first < import_volume_last
            ? t("an increment")
            : t("a decrement"),
        growth: numeral(Math.abs(growth_import), locale).format("0.0%"),
        volume_first: numeral(import_volume_first, locale).format("($0.00a)"),
        volume_last: numeral(import_volume_last, locale).format("($0.00a)")
      },
      export: {
        behavior:
          export_volume_first < export_volume_last
            ? t("an increment")
            : t("a decrement"),
        direction:
          export_volume_first < export_volume_last
            ? t("an increase")
            : t("a decrease"),
        growth: numeral(Math.abs(growth_export), locale).format("0.0%"),
        volume_first: numeral(export_volume_first, locale).format("($0.00a)"),
        volume_last: numeral(export_volume_last, locale).format("($0.00a)")
      },
      balance: {
        behavior: balance_volume_last > 0 ? t("positive") : t("negative"),
        beneficiary: balance_volume_last > 0 ? "Chile" : country.caption,
        volume_last: numeral(Math.abs(balance_volume_last), locale).format(
          "($0,.00a)"
        )
      }
    });

    let featureddatum_volume = null;
    const datum_export_volume =
      export_volume_last / global_exports_last_year[0];
    const datum_import_volume =
      import_volume_last / global_exports_last_year[0];

    if (datum_export_volume > 0.01) {
      featureddatum_volume = (
        <FeaturedDatum
          className="l-1-3"
          icon="exportaciones-en"
          datum={numeral(datum_export_volume, locale).format("0.0%")}
          title={t("Exports volume") + " (FOB)"}
          subtitle={t(
            "relative to exports to the world in {{year}}",
            sources.exports
          )}
        />
      );
    } else if (datum_import_volume > 0.01) {
      featureddatum_volume = (
        <FeaturedDatum
          className="l-1-3"
          icon="importaciones-en"
          datum={numeral(datum_import_volume, locale).format("0.0%")}
          title={t("Imports volume") + " (CIF)"}
          subtitle={t(
            "relative to imports from the world in {{year}}",
            sources.imports
          )}
        />
      );
    }

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("International Trade Balance")}
          </h3>
          <p
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />

          <div className="topic-slide-data">
            {featureddatum_volume}
            {Boolean(growth_import) && (
              <FeaturedDatum
                className="l-1-3"
                icon="product-import"
                datum={numeral(growth_import, locale).format("0.0%")}
                title={t("Change imports")}
                subtitle={t("in period {{year_first}} - {{year_last}}", {
                  year_first: sources.imports.min_year,
                  year_last: sources.imports.year
                })}
              />
            )}
            {Boolean(growth_export) && (
              <FeaturedDatum
                className="l-1-3"
                icon="product-export"
                datum={numeral(growth_export, locale).format("0.0%")}
                title={t("Change exports")}
                subtitle={t("in period {{year_first}} - {{year_last}}", {
                  year_first: sources.exports.min_year,
                  year_last: sources.exports.year
                })}
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(InternationalTradeBalanceSlide);
