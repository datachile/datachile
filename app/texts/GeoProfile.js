import { annualized_growth } from "helpers/calculator";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import groupBy from "lodash/groupBy";

function getRank(data, msrName, dimName, t) {
  let rank = data.sort((a, b) => b[msrName] - a[msrName]);
  rank = rank.length >= 3 ? rank.slice(0, 3) : rank;
  let output = rank.map(item => item[dimName]);
  output = output.length > 1 ? output.join(", ") : output;

  if (output.length > 1) {
    const lastComma = output.lastIndexOf(",");
    output =
      output.substring(0, lastComma) +
      " " +
      t("and") +
      output.substring(lastComma + 1);
  }

  return output;
}

// ECONOMY SECTION

function IndustryOccupation(data, locale, t) {
  if(data) {
    const rank = getRank(data.data, "Expansion Factor", "ISCO", t);
    return {
      text_joined_occupations: rank
    };
  } else {
    return false;
  }
}

function IndustryActivity(data, geo, locale, t) {
  const last_year = sources.tax_data.year;
  if (data) {
    const rank = getRank(data.data, "Output", "Level 1", t);
    const total = data.data.reduce((all, item) => {
      return all + item["Output"];
    }, 0);

    return {
      year: {
        last: last_year
      },
      total: numeral(total, locale).format("$ 0,0.0 a"),
      geo,
      text_joined_activities: rank
    };
  } else {
    return false;
  }
}

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

function PerformanceByHighSchool(data, locale, t) {
  if (data) {
    let rank = data.data.sort((a, b) => b["Average PSU"] - a["Average PSU"]);
    rank = rank.length >= 3 ? rank.slice(0, 3) : rank;

    let output = rank.map(item => item["Institution"]);
    output = output.length > 1 ? output.join(", ") : output;

    if (output.length > 1) {
      const lastComma = output.lastIndexOf(",");
      output =
        output.substring(0, lastComma) +
        " " +
        t("and") +
        output.substring(lastComma + 1);
    }

    return {
      text_joined_schools:
        (rank.length > 1 ? t("are") : t("is")) + " " + output,
      type:
        rank.length > 1 ? "plural" : rank.length === 1 ? "singular" : "no_data"
    };
  } else {
    return false;
  }
}

function PerformanceByPSUComuna(data, locale) {
  if (data) {
    let rank = data.data.sort((a, b) => b["Average PSU"] - a["Average PSU"]);
    return {
      location: {
        n_comunas: rank.length > 3 ? 3 : rank.length,
        first: {
          caption: rank[0]["Comuna"],
          prom: numeral(rank[0]["Average PSU"], locale).format("0.0")
        },
        second: {
          caption: rank[1] ? rank[1]["Comuna"] : "",
          prom: rank[1]
            ? numeral(rank[1]["Average PSU"], locale).format("0.0")
            : ""
        },
        third: {
          caption: rank[2] ? rank[2]["Comuna"] : "",
          prom: rank[2]
            ? numeral(rank[2]["Average PSU"], locale).format("0.0")
            : ""
        }
      }
    };
  } else {
    return false;
  }
}

function PerformanceByPSU(data, geo, locale, t) {
  const last_year = sources.education_performance_new.year;
  const lang = {
    en: {
      1: "Municipales",
      2: "Municipales",
      3: "Municipales",
      4: "Municipales"
    },
    es: {
      1: "Municipales",
      2: "Particulares Subvencionadas",
      3: "Particulares Pagadas",
      4: "de Administración Delegada"
    }
  };
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

    let output = data.data.map(item => {
      return (
        "de escuelas" +
        " " +
        lang[locale][item["ID Administration"]] +
        " " +
        t("fue") +
        " " +
        numeral(item["Average PSU"], locale).format("0") +
        " " +
        "puntos"
      );
    });
    output = output.length > 1 ? output.join(", ") : output;

    if (output.length > 1) {
      const lastComma = output.lastIndexOf(",");
      output =
        output.substring(0, lastComma) + " y" + output.substring(lastComma + 1);
    }

    return {
      year: {
        last: last_year
      },
      geo,
      psu,
      text_joined: output
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

export {
  IndustryActivity,
  IndustryOccupation,
  DeathCauses,
  Disability,
  Enrollment,
  PerformanceByPSU,
  PerformanceByPSUComuna,
  PerformanceByHighSchool
};
