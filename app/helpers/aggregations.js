import _ from "lodash";
import { numeral } from "helpers/formatters";

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
  const max_year = _.maxBy(aggregation, function(o) {
    return o["ID Year"];
  })["ID Year"];

  const by_date_array = _.groupBy(aggregation, function(obj, children) {
    return obj["ID Year"];
  });

  const by_date = _.mapValues(by_date_array, function(array) {
    return _.sumBy(array, function(o) {
      return o[trade_measure] && !isNaN(o[trade_measure])
        ? parseInt(o[trade_measure])
        : 0;
    });
  });

  const first_year = _.minBy(aggregation, function(o) {
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

  const total_trade_latest_year = _.sumBy(top_trade_latest_year, function(o) {
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
    increased_or_decreased: annualized_rate > 0 ? "increased" : "decreased",
    trade_first_product: top_trade_latest_year[0].HS2,
    trade_first_product_link: top_trade_latest_year[0]["ID HS2"],
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
    p_text_values.trade_second_product_link =
      top_trade_latest_year[1]["ID HS2"];
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

function info_from_data(
  aggregation,
  msrName,
  territoryKey,
  locale = "en",
  format = "($ 0.00 a)"
) {
  aggregation = aggregation.sort((a, b) => {
    return b[msrName] - a[msrName];
  });

  const total = aggregation.reduce((all, item) => {
    return all + item[msrName];
  }, 0);

  return {
    total: numeral(total, locale).format(format),
    territory: {
      first: aggregation[0][territoryKey],
      second: aggregation[1][territoryKey],
      third: aggregation[2][territoryKey]
    },
    share: {
      first: numeral(aggregation[0][msrName] / total, locale).format("0%"),
      second: numeral(aggregation[1][msrName] / total, locale).format("0%"),
      third: numeral(aggregation[2][msrName] / total, locale).format("0%")
    },
    values: {
      first: aggregation[0][msrName],
      second: aggregation[1][msrName],
      third: aggregation[2][msrName]
    }
  };
}

export { trade_by_time_and_product, info_from_data };
