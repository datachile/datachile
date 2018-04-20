import { annualized_growth } from "helpers/calculator";
import { sources } from "helpers/consts";
import { numeral, joinWithAnd } from "helpers/formatters";

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

// EDUCATION SECTION

export function SNED(data, locale) {
  if (data) {
    const rural = data.data.find(item => item["ID Stage 1a"] === 2) || {
      "Number of records": 0
    };
    const urban = data.data.find(item => item["ID Stage 1a"] === 1) || {
      "Number of records": 0
    };
    const special = data.data.find(item => item["ID Stage 1a"] === 3) || {
      "Number of records": 0
    };
    const total = data.data.reduce((all, item) => {
      return all + item["Number of records"];
    }, 0);
    return {
      rural: {
        n: rural["Number of records"],
        perc: numeral(rural["Number of records"] / total, locale).format(
          "0.00%"
        )
      },
      urban: {
        n: urban["Number of records"],
        perc: numeral(urban["Number of records"] / total, locale).format(
          "0.00%"
        )
      },
      special: {
        n: special["Number of records"],
        perc: numeral(special["Number of records"] / total, locale).format(
          "0.00%"
        )
      },
      total
    };
  } else {
    return false;
  }
}

// ECONOMY SECTION

function SpendingByIndustry(data, msrName, locale, t) {
  if (data) {
    const rank = data.data.sort((a, b) => b[msrName] - a[msrName]);
    const total = data.data.reduce((all, item) => {
      return all + item[msrName];
    }, 0);
    return {
      industry: {
        total: numeral(total, locale).format("($ 0.[00] a)"),
        first: { caption: rank[0]["Level 1"] },
        second: { caption: rank[1]["Level 1"] }
      },
      year: { last: sources.rd_survey.last_year }
    };
  }
}

function SpendingBySector(data, msrName, geo, locale, t) {
  if (data) {
    const rank = getRank(data.data, msrName, "Ownership Type", t);
    const total = data.data.reduce((all, item) => {
      return all + item[msrName];
    }, 0);
    return {
      year_sector: { last: sources.rd_survey.last_year - 1 },
      sector: { total: numeral(total, locale).format("($ 0.[00] a)") },
      geo,
      text_joined_industries: rank
    };
  }
}

function IndustryOccupation(data, locale, t) {
  if (data) {
    const rank = getRank(data.data, "Expansion Factor", "ISCO", t);
    return { text_joined_occupations: rank };
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
      year: { last: last_year },
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
      ).format("0,0"),
      total: numeral(
        data.data.reduce((all, item) => {
          return all + item["Number of records"];
        }, 0),
        locale
      ).format("0,0"),
      total_clean: data.data.reduce((all, item) => {
        return all + item["Number of records"];
      }, 0)
    };
    return { year: { last: last_year }, geo, enrollment };
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
      1: "Municipal",
      2: "Subsidised",
      3: "Private",
      4: "Delegated Administration"
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

    return { year: { last: last_year }, geo, psu, text_joined: output };
  } else {
    return false;
  }
}

function getTotal(data, msrName) {
  return data.reduce((all, item) => {
    return item[msrName] + all;
  }, 0);
}

// ENVIRONMENT SECTION

function Crime(data, geo, locale, t) {
  if (data) {
    const data_last_year = data.data.filter(
      item => item["ID Year"] === sources.crimes.year
    );
    const total_last_year = data_last_year.reduce((all, item) => {
      return all + item["Cases"];
    }, 0);

    const data_theft = data.data.filter(item => item["ID Crime Group"] === 1);
    const theft_growth = annualized_growth([
      getTotal(
        data_theft.filter(item => item["ID Year"] === sources.crimes.year - 1),
        "Cases"
      ),
      getTotal(
        data_theft.filter(item => item["ID Year"] === sources.crimes.year),
        "Cases"
      )
    ]);

    const total_larceny = data_last_year
      .filter(item => item["ID Crime Group"] === 2)
      .reduce((all, item) => {
        return all + item["Cases"];
      }, 0);

    const total_theft = data_last_year
      .filter(item => item["ID Crime Group"] === 1)
      .reduce((all, item) => {
        return all + item["Cases"];
      }, 0);

    const rank = getRank(data_last_year, "Cases", "Crime", t);
    return {
      year: { first: sources.crimes.first_year, last: sources.crimes.year },
      text_joined: rank,
      geo,
      total_last_year,
      theft_growth,
      theft: {
        total: total_theft,
        growth: theft_growth,
        share: total_last_year > 0 ? total_theft / total_last_year : 0
      },
      larceny: {
        total: total_larceny,
        share: total_last_year > 0 ? total_larceny / total_last_year : 0
      }
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
      year: { last: last_year },
      gender: {
        female: {
          share: numeral(disability_female / total, locale).format("0.0 %")
        },
        male: { share: (total - disability_female) / total }
      },
      value: numeral(total, locale).format("0.0 a"),
      share: numeral(total / (total + no_disability), locale).format("0.0 %"),
      data: {
        prep: total >= 1000000 ? " de" : "",
        total: numeral(total, locale).format("0,0"),
        severe: { share: numeral(severe / total, locale).format("0.0 %") }
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

function Congress(data, geo, locale, t) {
  if (data) {
    let output = data.data.map(item => item["Candidate"]);
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
      geo,
      congresspersons: output
    };
  } else {
    return false;
  }
}

function Election(data, geo, locale) {
  if (data) {
    const first_round = data.data.find(item => item["ID Election Type"] === 1);
    const second_round = data.data.find(item => item["ID Election Type"] === 2);

    const top_participation = data.data.sort(
      (a, b) => b["Participation"] - a["Participation"]
    )[0];

    const growth = first_round
      ? (second_round.Votes - first_round.Votes) / first_round.Votes
      : false;
    return {
      geo,
      growth,
      participation: top_participation
        ? {
            caption: top_participation["Election Type"],
            year: top_participation["Year"],
            perc: numeral(top_participation["Participation"], locale).format(
              "0.00%"
            )
          }
        : {}
    };
  } else {
    return false;
  }
}

const sumVotesTotal = (sum, option) => sum + option.Votes;
const sumVotesInvalid = (sum, option) =>
  sum +
  (option["ID Candidate"] == 8 || option["ID Candidate"] == 9
    ? option.Votes
    : 0);
const sortByVotes = (a, b) => b.Votes - a.Votes;
const checkElected = candidate => candidate["ID Elected"] == 1;

function textCivicsMayor(geo, source, year, locale) {
  if (!source || !source.available) return false;

  const data = source.data;
  const electionYear = parseInt(year);
  const totalVotes = data.reduce(sumVotesTotal, 0);
  const totalNullVotes = data.reduce(sumVotesInvalid, 0);

  const output = {
    geo,
    year: {
      election: electionYear,
      first: electionYear,
      last: electionYear + 4
    },
    datum: {
      raw_total: totalVotes,
      raw_valid: totalVotes - totalNullVotes,
      total: numeral(totalVotes, locale).format("0,0"),
      valid: numeral((totalVotes - totalNullVotes) / totalVotes, locale).format(
        "0.0 %"
      )
    }
  };

  if (geo.depth === 2) {
    output.context = "person";

    const candidates = data.sort(sortByVotes);
    const cand_null = candidates.find(option => option["ID Candidate"] == 8);
    const cand_blank = candidates.find(option => option["ID Candidate"] == 9);

    output.candidates = candidates;
    output.votes = {
      total: numeral(candidates.reduce(sumVotesTotal, 0), locale).format(
        "(0,0)"
      ),
      blank: numeral(cand_blank ? cand_blank.Votes : 0, locale).format("(0,0)"),
      null: numeral(cand_null ? cand_null.Votes : 0, locale).format("(0,0)"),
      participation: "NaN%"
    };
  } else {
    output.context = "party";

    const partiesDict = groupBy(data, "Partido");
    const parties = Object.keys(partiesDict).map(partyName => ({
      name: partyName,
      total: partiesDict[partyName].filter(checkElected).length
    }));

    output.count = parties.length;
    output.parties = parties.sort((a, b) => b.total - a.total);
  }

  return output;
}

function textCivicsCongress(geo, source, year, locale) {
  if (!source || !source.available) return false;

  const data = source.data;
  const electionYear = parseInt(year);
  const years = {
    election: electionYear,
    first: electionYear + 1,
    last: electionYear + 5
  };

  const elections = groupBy(data, "ID Election Type");
  const senador = (elections[3] || []).sort(sortByVotes);
  const diputado = (elections[4] || []).sort(sortByVotes);
  const flag = (senador.length > 0 ? 1 : 0) + (diputado.length > 0 ? 2 : 0);

  const senTotalVotes = senador.reduce(sumVotesTotal, 0);
  const dipTotalVotes = diputado.reduce(sumVotesTotal, 0);

  const datum = {
    senTotal: numeral(senTotalVotes, locale).format("0,0"),
    dipTotal: numeral(dipTotalVotes, locale).format("0,0")
  };

  if (geo.depth > 0) {
    return {
      geo,
      datum,
      context: "person" + (flag || ""),
      year: years,
      congresspeople: joinWithAnd(
        diputado.map(option => option.Candidate),
        locale
      ),
      senators: joinWithAnd(senador.map(option => option.Candidate), locale)
    };
  } else {
    const sen_partiesDict = groupBy(senador, "Partido");
    const sen_parties = Object.keys(sen_partiesDict).map(partyName => ({
      name: partyName,
      total: sen_partiesDict[partyName].length
    }));
    const dip_partiesDict = groupBy(diputado, "Partido");
    const dip_parties = Object.keys(dip_partiesDict).map(partyName => ({
      name: partyName,
      total: dip_partiesDict[partyName].length
    }));

    return {
      geo,
      datum,
      context: "party",
      year: years,
      dipparties: dip_parties.sort((a, b) => b.total - a.total),
      senparties: sen_parties.sort((a, b) => b.total - a.total)
    };
  }
}

function textCivicsPresident(res, lang) {
  const data = res.data.data || [];
  if (data.length == 0) return false;

  const electionYear =
    sources.election_results_update.presidential_election_year;

  const valids = data.filter(
    item => item["ID Candidate"] != 8 && item["ID Candidate"] != 9
  );
  const round1 = valids
    .filter(item => item["ID Election Type"] === 1)
    .sort(sortByVotes);
  const round2 = valids
    .filter(item => item["ID Election Type"] === 2)
    .sort(sortByVotes);

  const round1Total = round1.reduce(sumVotesTotal, 0);
  const round2Total = round2.reduce(sumVotesTotal, 0);

  return {
    year: {
      election: electionYear,
      first: electionYear + 1,
      last: electionYear + 5
    },
    round1: round1.map(candidate => {
      delete candidate["ID Candidate"];
      delete candidate["Election Type"];
      delete candidate["ID Election Type"];
      candidate.share = numeral(candidate.Votes / round1Total, lang).format(
        "0.0 %"
      );
      candidate.votes = numeral(candidate.Votes, lang).format("0,0");
      return candidate;
    }),
    round2: round2.map(candidate => {
      delete candidate["ID Candidate"];
      delete candidate["Election Type"];
      delete candidate["ID Election Type"];
      candidate.share = numeral(candidate.Votes / round2Total, lang).format(
        "0.0 %"
      );
      candidate.votes = numeral(candidate.Votes, lang).format("0,0");
      return candidate;
    })
  };
}

function textCivicsParticipation(t, geo, source, year, locale) {
  if (!source || !source.available) return false;

  const data = source.data;
  const electionYear = parseInt(year);
  const output = {
    geo,
    position: t("mayor"),
    year: {
      election: electionYear,
      first: electionYear,
      last: electionYear + 4
    }
  };
  const sum_nulls = data.reduce(
    (sum, option) => sum + (option["ID Candidate"] == 8 ? option.Votes : 0),
    0
  );
  const sum_blanks = data.reduce(
    (sum, option) => sum + (option["ID Candidate"] == 9 ? option.Votes : 0),
    0
  );
  output.votes = {
    total: numeral(data.reduce(sumVotesTotal, 0), locale).format("0,0"),
    blank: numeral(sum_blanks, locale).format("0,0"),
    null: numeral(sum_nulls, locale).format("0,0"),
    participation: "NaN%"
  };
}

export {
  Crime,
  Congress,
  SpendingByIndustry,
  SpendingBySector,
  IndustryActivity,
  IndustryOccupation,
  DeathCauses,
  Disability,
  Enrollment,
  PerformanceByPSU,
  PerformanceByPSUComuna,
  PerformanceByHighSchool,
  textCivicsMayor,
  textCivicsCongress,
  textCivicsPresident,
  Election
};
