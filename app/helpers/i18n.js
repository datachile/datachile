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

function trade_by_time_and_product(
    aggregation,
    trade_measure,
    show_rank = true
) {
    var p_text_values = {
        latest_year: 0,
        rank: 0,
        trade_volume: 0,
        first_year: 0,
        trade_first_year: 0,
        last_year: 0,
        trade_last_year: 0,
        annualized_rate: 0,
        increased_or_decreased: 0,
        trade_first_product: 0,
        trade_first_val: 0,
        trade_first_share: 0,
        number_of_years: 0,
        trade_second_product: 0,
        trade_second_share: 0
    };

    return p_text_values;
}

export { trade_by_time_and_product };
