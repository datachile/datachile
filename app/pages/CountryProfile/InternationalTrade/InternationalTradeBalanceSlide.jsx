import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import flattenDeep from "lodash/flattenDeep";

import FeaturedDatum from "components/FeaturedDatum";

import mondrianClient, { getCountryCut } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { accumulated_growth } from "helpers/aggregations";
import { numeral } from "helpers/formatters";

class InternationalTradeBalanceSlide extends Section {
  static need = [
    function datumExportsPerYearNeed(params, store) {
      const lang = store.i18n.locale;

      const promise = mondrianClient
        .cube("exports")
        .then(cube => {
          const query = cube.query
            .drilldown("Date", "Date", "Year")
            .cut(`[Country].[Country].${getCountryCut(params)}`)
            .measure("FOB US")
            .option("parents", false);

          return mondrianClient.query(query);
        })
        .then(res => ({
          key: "datum_country_exports_per_year",
          data: flattenDeep(res.data.values)
        }));

      return {
        type: "GET_DATA",
        promise
      };
    },
    function datumImportsPerYearNeed(params, store) {
      const lang = store.i18n.locale;

      const promise = mondrianClient
        .cube("imports")
        .then(cube => {
          const query = cube.query
            .drilldown("Date", "Date", "Year")
            .cut(`[Country].[Country].${getCountryCut(params)}`)
            .measure("CIF US")
            .option("parents", false);

          return mondrianClient.query(query);
        })
        .then(res => ({
          key: "datum_country_imports_per_year",
          data: flattenDeep(res.data.values)
        }));

      return {
        type: "GET_DATA",
        promise
      };
    }
  ];

  direction(a, t) {
    return a[0] < a[a.length - 1] ? t("incremento") : t("decrecimiento");
  }

  render() {
    const { t, children, i18n } = this.props;
    const locale = i18n.locale;

    const {
      country,
      datum_country_imports_per_year,
      datum_country_exports_per_year
    } = this.context.data;

    const growth_export = accumulated_growth(
      datum_country_exports_per_year,
      locale
    );
    const growth_import = accumulated_growth(
      datum_country_imports_per_year,
      locale
    );

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
        volume_last: numeral(
          datum_country_imports_per_year[
            datum_country_imports_per_year.length - 1
          ],
          locale
        ).format("($ 0.00 a)")
      },
      export: {
        growth: growth_export,
        direction: this.direction(datum_country_exports_per_year, t),
        volume_first: numeral(datum_country_exports_per_year[0], locale).format(
          "($ 0.00 a)"
        ),
        volume_last: numeral(
          datum_country_exports_per_year[
            datum_country_exports_per_year.length - 1
          ],
          locale
        ).format("($ 0.00 a)")
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
              icon="industria"
              datum={"x"}
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

export default translate()(InternationalTradeBalanceSlide);
