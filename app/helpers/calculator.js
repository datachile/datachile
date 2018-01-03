/** Calculate Compound Annual Growth Rate */
function annualized_growth(aggregation, time = null) {
  if (aggregation) {
    const range = time ? time[1] - time[0] : aggregation.length;
    const initial_v = aggregation[0];
    const final_v = aggregation[aggregation.length - 1];
    return Math.pow(final_v / initial_v, 1 / range) - 1;
  } else {
    return NaN;
  }
}

function accumulatedGrowth(aggregation) {
  if (!Array.isArray(aggregation)) return NaN;
  return Math.log(aggregation[aggregation.length - 1] / aggregation[0]);
}

export { accumulatedGrowth, annualized_growth };
