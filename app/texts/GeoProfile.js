import { annualized_growth } from "helpers/calculator";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import groupBy from "lodash/groupBy";

function Disability(data, geo, locale) {
  const last_year = sources.disabilities.year;
  if (data) {
    const severe = data.data.find(item => item["ID Disability Grade"] === 2);
    const total = data.data.reduce((all, item) => {
      return all + item["Expansion Factor Region"];
    }, 0);
    return {
      geo,
      year: {
        last: last_year
      },
      data: {
        prep: total >= 1000000 ? " de" : "",
        total: numeral(total, locale).format("0,0"),
        severe: {
          share: numeral(severe / total, locale).format("0.0 %")
        }
      }
    };
  }
}

function DeathCauses(data, geo, locale) {
  const first_year = sources.death_causes.min_year;
  const last_year = sources.death_causes.year;
  if (data) {
    const aggregation = groupBy(data.data, "CIE 10");
    const q = Object.keys(aggregation)
      .map(item => {
        return {
          caption: item,
          rate: annualized_growth(
            aggregation[item].map(subitem => subitem["Casualities Count SUM"]),
            [first_year, last_year]
          )
        };
      })
      .sort((a, b) => b.rate - a.rate);
    return {
      geo,
      year: {
        number: last_year - first_year,
        first: first_year,
        last: last_year
      },
      available: true,
      data: {
        first: {
          caption: q[0].caption,
          rate: numeral(q[0].rate, locale).format("0.0 %"),
          value_first_y: numeral(q[0].value_first_y, locale).format("0,0"),
          value_last_y: numeral(q[0].value_last_y, locale).format("0,0")
        },
        second: {
          caption: q[1].caption,
          rate: numeral(q[1].rate, locale).format("0.0 %"),
          value_first_y: numeral(q[1].value_first_y, locale).format("0,0"),
          value_last_y: numeral(q[1].value_last_y, locale).format("0,0")
        }
      }
    };
  } else {
    return false;
  }
}

export { DeathCauses, Disability };
