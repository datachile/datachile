import { annualized_growth } from "helpers/calculator";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import sum from "lodash/sum";

const first_year = sources.exports.min_year;
const last_year = sources.exports.year;

const base = {
  year: {
    number: last_year - first_year,
    first: first_year,
    last: last_year
  },
  available: true
};

function InternationalTradeBalance(product, exports, imports, t) {
  return {
    ...base,
    product,
    exports: trade_balance_text(exports, t),
    imports: trade_balance_text(imports, t),
    format:
      sum(exports) > 0 && sum(imports) > 0
        ? "default"
        : sum(exports) > 0
          ? "exports"
          : sum(imports) > 0 ? "imports" : "neither"
  };
}

function IndexProductProfile(product, exports, imports, locale, t) {
  return {
    ...base,
    product,
    exports: about_text(
      exports,
      "FOB US",
      "Country",
      base.year.last,
      t,
      locale
    ),
    imports: about_text(
      imports,
      "CIF US",
      "Country",
      base.year.last,
      t,
      locale
    ),
    format: "default"
  };
}

function about_text(
  aggregation,
  msrName,
  territoryKey,
  last_year,
  t,
  locale = "en",
  format = "($ 0.00 a)"
) {
  if (typeof aggregation !== "undefined") {
    aggregation = aggregation.data.sort((a, b) => {
      return b[msrName] - a[msrName];
    });

    const total = aggregation.reduce((all, item) => {
      return all + item[msrName];
    }, 0);

    return {
      available: aggregation.available,
      total: numeral(total, locale).format(format),
      n_countries: aggregation.length > 3 ? 3 : aggregation.length,
      territory: {
        first: aggregation[0] ? aggregation[0][territoryKey] : "",
        second: aggregation[1] ? aggregation[1][territoryKey] : "",
        third: aggregation[2] ? aggregation[2][territoryKey] : ""
      },
      share: {
        first: aggregation[0]
          ? numeral(aggregation[0][msrName] / total, locale).format("0.0 %")
          : "",
        second: aggregation[1]
          ? numeral(aggregation[1][msrName] / total, locale).format("0.0 %")
          : "",
        third: aggregation[2]
          ? numeral(aggregation[2][msrName] / total, locale).format("0.0 %")
          : ""
      },
      values: {
        first: aggregation[0] ? aggregation[0][msrName] : "",
        second: aggregation[1] ? aggregation[1][msrName] : "",
        third: aggregation[2] ? aggregation[2][msrName] : ""
      }
    };
  } else {
    return { available: false };
  }
}

function trade_balance_text(
  aggregation,
  t,
  locale = "en",
  format = "($ 0.00 a)"
) {
  if (aggregation) {
    const growth_rate = annualized_growth(aggregation);

    return {
      growth_rate: numeral(growth_rate, locale).format("0.0 %"),
      increased_or_decreased: growth_rate > 0 ? t("increased") : t("decreased"),
      value: {
        first: numeral(aggregation[0], locale).format(format),
        last: numeral(aggregation[aggregation.length - 1], locale).format(
          format
        )
      }
    };
  } else {
    return {
      growth_rate: t("No data"),
      increased_or_decreased: t("No data"),
      value: {
        first: t("No data"),
        last: t("No data")
      }
    };
  }
}

export { IndexProductProfile, InternationalTradeBalance };
