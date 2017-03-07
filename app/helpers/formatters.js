import {format, formatPrefix} from "d3-format";
import {timeFormat} from "d3-time-format";

function abbreviate(n) {
  if (n === undefined || n === null) return "N/A";

  const length = n.toString().split(".")[0].length;

  if (n === 0) return "0";
  else if (length > 3) return formatPrefix(",.0", n)(n).replace("G", "B");
  else if (length === 3) return format(",f")(n);
  else if (n === parseInt(n, 10)) return format(".2")(n);
  else return format(".3g")(n);

}

export const FORMATTERS = {
  commas: format(","),
  date: timeFormat("%B %d, %Y"),
  ordinal: n => {
    if (n > 3 && n < 21) return `${n}th`; // thanks kennebec
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  },
  round: format(",.0f"),
  share: format(".2%"),
  shareWhole: format(".0%"),
  year: y => y < 0 ? `${Math.abs(y)} BC` : y
};

export const VARIABLES = {
  harvested_area: d => `${abbreviate(d)} ha`,
  rainfall_awa_mm: d => `${FORMATTERS.round(d)}mm`,
  value_of_production: d => `Intl.$${abbreviate(d)}`,
  value_density: d => `Intl.$ ${abbreviate(d)} per ha`,
  totpop: d => abbreviate(d)
};
