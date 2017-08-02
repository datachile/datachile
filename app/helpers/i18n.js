import _ from "lodash";
/*def trade_by_time_and_product(aggregation, trade_measure, show_rank=True):
   dataframe = aggregation.to_pandas()

    max_year = dataframe.index.get_level_values('ID Year').max()
    by_date = dataframe.sum(level='ID Year')
    first_year = dataframe.index.get_level_values('ID Year').min()
    trade_first_year = by_date.loc[first_year][trade_measure]
    trade_last_year = by_date.loc[max_year][trade_measure]
    annualized_rate = annualized_growth(trade_last_year, trade_first_year,
                                        max_year, first_year)
    top_trade_latest_year = dataframe.loc[max_year].sort_values(trade_measure,
                                                         ascending=False)
    p_text_values = {
        'latest_year': max_year,
        'rank': int(dataframe.loc[max_year]['Geo Rank Across Time'].iloc[0]) if show_rank else None,
        'trade_volume': millify(dataframe.loc[max_year][trade_measure].sum()),
        'first_year': first_year,
        'trade_first_year': millify(trade_first_year),
        'last_year': max_year,
        'trade_last_year': millify(trade_last_year),
        'annualized_rate': format_percent(annualized_rate),
        'increased_or_decreased': _('increased') if annualized_rate > 0 else _('decreased'),
        'trade_first_product': top_trade_latest_year.iloc[0].name[-1],
        'trade_first_val': millify(top_trade_latest_year.iloc[0][trade_measure]),
        'trade_first_share': format_percent(top_trade_latest_year.iloc[0][trade_measure] / top_trade_latest_year[trade_measure].sum()),
        'number_of_years': num2words(max_year - first_year)
    }

    #bypass
    if(top_trade_latest_year.size > 2):
        p_text_values['trade_second_product'] = top_trade_latest_year.iloc[1].name[-1]
        p_text_values['trade_second_share'] = format_percent(top_trade_latest_year.iloc[1][trade_measure] / top_trade_latest_year[trade_measure].sum())
    else:
        p_text_values['trade_second_product'] = '-'
        p_text_values['trade_second_share'] = '-'
    
    return p_text_values
*/

function annualized_growth(last_v, first_v, last_time, first_time) {
    var temp = parseFloat(last_time) - parseFloat(first_time);
    //bypass
    if (temp == 0) {
        temp = 1;
    }

    return Math.pow(last_v / first_v, 1 / temp) - 1;
}

function trade_by_time_and_product(
    aggregation,
    trade_measure,
    show_rank = true
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

    const top_trade_latest_year = _.sortBy(
        by_date_array[max_year],
        trade_measure,
        "desc"
    );

    const total_trade_latest_year = _.sumBy(top_trade_latest_year, function(o) {
        return o[trade_measure] && !isNaN(o[trade_measure])
            ? parseInt(o[trade_measure])
            : 0;
    });

    /*p_text_values = {
        'latest_year': max_year,
        'rank': int(dataframe.loc[max_year]['Geo Rank Across Time'].iloc[0]) if show_rank else None,
        'trade_volume': millify(dataframe.loc[max_year][trade_measure].sum()),
        'first_year': first_year,
        'trade_first_year': millify(trade_first_year),
        'last_year': max_year,
        'trade_last_year': millify(trade_last_year),
        'annualized_rate': format_percent(annualized_rate),
        'increased_or_decreased': _('increased') if annualized_rate > 0 else _('decreased'),
        'trade_first_product': top_trade_latest_year.iloc[0].name[-1],
        'trade_first_val': millify(top_trade_latest_year.iloc[0][trade_measure]),
        'trade_first_share': format_percent(top_trade_latest_year.iloc[0][trade_measure] / top_trade_latest_year[trade_measure].sum()),
        'number_of_years': num2words(max_year - first_year)
    }*/

    console.log("TOP cero", top_trade_latest_year[0]);

    var p_text_values = {
        latest_year: max_year,
        rank: by_date_array[max_year][0]["Geo Rank Across Time"],
        trade_volume: total_trade_latest_year,
        first_year: first_year,
        trade_first_year: trade_first_year,
        last_year: max_year,
        trade_last_year: trade_last_year,
        annualized_rate: annualized_rate,
        increased_or_decreased: annualized_rate > 0 ? "increased" : "decreased",
        trade_first_product: top_trade_latest_year[0].name,
        trade_first_val: parseInt(top_trade_latest_year[0][trade_measure]),
        trade_first_share:
            parseInt(top_trade_latest_year[0][trade_measure]) /
            total_trade_latest_year,
        number_of_years: max_year - first_year
    };

    if (top_trade_latest_year.length > 2) {
        p_text_values.trade_second_product = parseInt(
            top_trade_latest_year[1].name
        );
        p_text_values.trade_second_share =
            parseInt(top_trade_latest_year[1][trade_measure]) /
            total_trade_latest_year;
    } else {
        p_text_values.trade_second_product = "-";
        p_text_values.trade_second_share = "-";
    }

    return p_text_values;
}

export { trade_by_time_and_product };
