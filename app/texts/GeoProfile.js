import { annualized_growth } from "helpers/calculator";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import groupBy from "lodash/groupBy";

// EDUCATION SECTION
function Enrollment(data, geo, locale) {
  const last_year = sources.education_enrollment.year;
  if (data) {
    const enrollment = {
      municipal: numeral(
        data.data
          .filter(item => [1, 2].includes(item["ID Administration"]))
          .reduce((all, item) => {
            return all + item["Number of records"];
          }, 0),
        locale
      ).format("0,0"),
      subvencionado: numeral(
        data.data
          .filter(item => [3].includes(item["ID Administration"]))
          .reduce((all, item) => {
            return all + item["Number of records"];
          }, 0),
        locale
      ).format("0,0"),
      particular: numeral(
        data.data
          .filter(item => [4].includes(item["ID Administration"]))
          .reduce((all, item) => {
            return all + item["Number of records"];
          }, 0),
        locale
      ).format("0,0"),
      adm_delegada: numeral(
        data.data
          .filter(item => [5].includes(item["ID Administration"]))
          .reduce((all, item) => {
            return all + item["Number of records"];
          }, 0),
        locale
      ).format("0,0")
    };
    return {
      year: {
        last: last_year
      },
      geo,
      enrollment
    };
  } else {
    return false;
  }
}

function PerformanceByPSU(data, geo, locale) {
  const last_year = sources.education_performance_new.year;
  if (data) {
    const psu = {
      municipal: numeral(
        data.data
          .filter(item => item["ID Administration"] === 1)
          .reduce((all, item) => {
            return all + item["Average PSU"];
          }, 0),
        locale
      ).format("0,0"),
      subvencionado: numeral(
        data.data
          .filter(item => item["ID Administration"] === 2)
          .reduce((all, item) => {
            return all + item["Average PSU"];
          }, 0),
        locale
      ).format("0,0"),
      particular: numeral(
        data.data
          .filter(item => item["ID Administration"] === 3)
          .reduce((all, item) => {
            return all + item["Average PSU"];
          }, 0),
        locale
      ).format("0,0"),
      adm_delegada: numeral(
        data.data
          .filter(item => item["ID Administration"] === 4)
          .reduce((all, item) => {
            return all + item["Average PSU"];
          }, 0),
        locale
      ).format("0,0")
    };
    return {
      year: {
        last: last_year
      },
      geo,
      psu
    };
  } else {
    return false;
  }
}

// HEALTH SECTION

function Disability(data, geo, locale) {
  const last_year = sources.disabilities.year;
  if (data) {
    const no_disability = data.data
      .filter(item => item["ID Disability Grade"] === 1)
      .reduce((all, item) => {
        return all + item["Expansion Factor Region"];
      }, 0);
    const leve = data.data
      .filter(item => item["ID Disability Grade"] === 2)
      .reduce((all, item) => {
        return all + item["Expansion Factor Region"];
      }, 0);
    const severe = data.data
      .filter(item => item["ID Disability Grade"] === 3)
      .reduce((all, item) => {
        return all + item["Expansion Factor Region"];
      }, 0);

    const total = leve + severe;
    const disability_female = data.data
      .filter(
        item =>
          [2, 3].includes(item["ID Disability Grade"]) && item["ID Sex"] === 1
      )
      .reduce((all, item) => {
        return all + item["Expansion Factor Region"];
      }, 0);
    return {
      geo,
      year: {
        last: last_year
      },
      gender: {
        female: {
          share: numeral(disability_female / total, locale).format("0.0 %")
        },
        male: {
          share: (total - disability_female) / total
        }
      },
      value: numeral(total, locale).format("0,0 a"),
      share: numeral(total / (total + no_disability), locale).format("0.0 %"),
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

export { DeathCauses, Disability, Enrollment, PerformanceByPSU };
