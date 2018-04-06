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

function percentRank(arr, v) {
	if (typeof v !== "number") throw new TypeError("v must be a number");
	for (var i = 0, l = arr.length; i < l; i++) {
		if (v <= arr[i]) {
			while (i < l && v === arr[i]) i++;
			if (i === 0) return 0;
			if (v !== arr[i - 1]) {
				i += (v - arr[i - 1]) / (arr[i] - arr[i - 1]);
			}
			return i / l;
		}
	}
	return 1;
}

function quantile(array, percentile) {
	array.sort((a, b) => a - b);
	let result;
	let index = percentile/100. * (array.length-1);
	if (Math.floor(index) == index) {
		let result = array[index];
	} else {
			let i = Math.floor(index)
			let fraction = index - i;
			let result = array[i] + (array[i+1] - array[i]) * fraction;
	}
	return result;
}

export { accumulatedGrowth, annualized_growth, percentRank, quantile };
