import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";
import groupBy from "lodash/groupBy";
import mapValues from "lodash/mapValues";
import sumBy from "lodash/sumBy";

import { numeral, slugifyItem } from "helpers/formatters";

function annualized_growth(last_v, first_v, last_time, first_time) {
  var temp = parseFloat(last_time) - parseFloat(first_time);
  //bypass
  if (temp === 0) {
    temp = 1;
  }

  return Math.pow(last_v / first_v, 1 / temp) - 1;
}

function trade_by_time_and_product(
  aggregation,
  trade_measure,
  show_rank = true,
  locale = "en"
) {
  const max_year = maxBy(aggregation, function(o) {
    return o["ID Year"];
  })["ID Year"];

  const by_date_array = groupBy(aggregation, function(obj, children) {
    return obj["ID Year"];
  });

  const by_date = mapValues(by_date_array, function(array) {
    return sumBy(array, function(o) {
      return o[trade_measure] && !isNaN(o[trade_measure])
        ? parseInt(o[trade_measure])
        : 0;
    });
  });

  const first_year = minBy(aggregation, function(o) {
    return o["ID Year"];
  })["ID Year"];

  const trade_first_year = by_date[first_year];
  const trade_last_year = by_date[max_year];
  const annualized_rate = annualized_growth(
    trade_last_year,
    trade_first_year,
    max_year,
    first_year
  );

  const current_trade_array = by_date_array[max_year];

  const top_trade_latest_year = current_trade_array.sort(function(a, b) {
    return b[trade_measure] - a[trade_measure];
  });

  const total_trade_latest_year = sumBy(top_trade_latest_year, function(o) {
    return o[trade_measure] && !isNaN(o[trade_measure])
      ? parseInt(o[trade_measure])
      : 0;
  });

  var p_text_values = {
    latest_year: max_year,
    rank: numeral(
      current_trade_array[0]["Geo Rank Across Time"],
      locale
    ).format("0o"),
    trade_volume: numeral(total_trade_latest_year, locale).format("($ 0.00 a)"),
    first_year: first_year,
    trade_first_year: numeral(trade_first_year, locale).format("($ 0.00 a)"),
    last_year: max_year,
    trade_last_year: numeral(trade_last_year, locale).format("($ 0.00 a)"),
    annualized_rate: numeral(annualized_rate, locale).format("0%"),
    increased: annualized_rate > 0 ? true : false,
    trade_first_product: top_trade_latest_year[0].HS2,
    trade_first_product_link: slugifyItem(
      "products",
      top_trade_latest_year[0]["ID HS0"],
      top_trade_latest_year[0]["HS0"],
      top_trade_latest_year[0]["ID HS2"],
      top_trade_latest_year[0]["HS2"]
    ),
    trade_first_val: parseInt(top_trade_latest_year[0][trade_measure]),
    trade_first_share: numeral(
      parseInt(top_trade_latest_year[0][trade_measure]) /
        total_trade_latest_year,
      locale
    ).format("0%"),
    number_of_years: max_year - first_year
  };

  if (top_trade_latest_year.length > 2) {
    p_text_values.trade_second_product = top_trade_latest_year[1].HS2;
    p_text_values.trade_second_product_link = slugifyItem(
      "products",
      top_trade_latest_year[1]["ID HS0"],
      top_trade_latest_year[1]["HS0"],
      top_trade_latest_year[1]["ID HS2"],
      top_trade_latest_year[1]["HS2"]
    );
    p_text_values.trade_second_share = numeral(
      parseInt(top_trade_latest_year[1][trade_measure]) /
        total_trade_latest_year,
      locale
    ).format("0%");
  } else {
    p_text_values.trade_second_product = "-";
    p_text_values.trade_second_share = "-";
  }

  return p_text_values;
}

function maxMinGrowthByYear(aggregation, measure, locale = "en") {
  const last_year = maxBy(aggregation, function(o) {
    return o["ID Year"];
  })["ID Year"];

  const by_date_array = groupBy(aggregation, function(obj, children) {
    return obj["ID Year"];
  });

  const by_date = mapValues(by_date_array, function(array) {
    return sumBy(array, function(o) {
      return o[measure] && !isNaN(o[measure]) ? parseInt(o[measure]) : 0;
    });
  });

  const first_year = minBy(aggregation, function(o) {
    return o["ID Year"];
  })["ID Year"];

  const value_first_year = by_date[first_year];
  const value_last_year = by_date[last_year];
  const annualized_rate = annualized_growth(
    value_last_year,
    value_first_year,
    last_year,
    first_year
  );

  return {
    first_year: first_year,
    first_year_value: numeral(value_first_year, locale).format("($ 0.0 a)"),
    last_year: last_year,
    last_year_value: numeral(value_last_year, locale).format("($ 0.0 a)"),
    annualized_rate: numeral(annualized_rate, locale).format("0%"),
    increased: annualized_rate > 0 ? true : false,
    number_of_years: last_year - first_year
  };
}

export { trade_by_time_and_product, maxMinGrowthByYear };
