import { annualized_growth } from "helpers/calculator";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

const first_year = sources.exports.min_year;
const last_year = sources.exports.year;

const base = {
  year: {
    number: last_year - first_year,
    first: first_year,
    last: last_year
  }
};

function InternationalTradeBalance(product, exports, imports, t) {
  return {
    ...base,
    product,
    exports: trade_balance_text(exports.data, t),
    imports: trade_balance_text(imports.data, t),
    format:
      exports.available && imports.available
        ? "default"
        : exports.available
          ? "exports"
          : imports.available ? "imports" : "neither"
  };
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
      growth_rate: "No data",
      increased_or_decreased: "No data",
      value: {
        first: "No data",
        last: "No data"
      }
    };
  }
}

export { InternationalTradeBalance };
