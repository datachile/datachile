import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { sources } from "helpers/consts";

export function needGetGeo(params) {
  const geoObj = getGeoObject(params);

  var prm;

  switch (geoObj.type) {
    case "country": {
      prm = new Promise((resolve, reject) => {
        resolve({ key: "geo", data: geoObj });
      });
      break;
    }
    case "region": {
      prm = mondrianClient
        .cube("exports")
        .then(cube => {
          return cube.dimensionsByName["Geography"].hierarchies[0].getLevel(
            "Region"
          );
        })
        .then(level => {
          return mondrianClient.member(level, geoObj.key);
        })
        .then(res => {
          return { key: "geo", data: res };
        });
      break;
    }
    case "comuna": {
      prm = mondrianClient
        .cube("exports")
        .then(cube => {
          return cube.dimensionsByName["Geography"].hierarchies[0].getLevel(
            "Comuna"
          );
        })
        .then(level => {
          return mondrianClient.member(level, geoObj.key);
        })
        .then(res => {
          return { key: "geo", data: res };
        });
      break;
    }
  }

  return {
    type: "GET_DATA",
    promise: prm
  };
}

export function needGetPopulationDatum(params, store) {
  const geo = getGeoObject(params);
  const prm = mondrianClient
    .cube("population_estimate")
    .then(cube => {
      var q = geoCut(
        geo,
        "Geography",
        cube.query
          .drilldown("Date", "Year")
          .measure("Number of records")
          .measure("Population")
          .measure("Population Rank")
          .measure("Population Rank Total")
          .measure("Population Rank Decile"),
        store.i18n.locale
      );

      q.cut(`[Date].[Year].&[${store.population_year}]`);
      return mondrianClient.query(q, "jsonrecords");
    })
    .then(res => {
      return {
        key: "population",
        data: {
          value: res.data.data[0]["Population"],
          decile: res.data.data[0]["Population Rank Decile"],
          rank: res.data.data[0]["Population Rank"],
          total: res.data.data[0]["Population Rank Total"],
          year: store.population_year,
          source: "INE projection"
        }
      };
    });

  return {
    type: "GET_DATA",
    promise: prm
  };
}

export function needGetIncomeDatum(params, store) {
  var geo = getGeoObject(params);
  if (geo.type == "comuna") {
    geo = geo.ancestor;
  }
  const prm = mondrianClient
    .cube("nesi_income")
    .then(cube => {
      var q = geoCut(
        geo,
        "Geography",
        cube.query
          .drilldown("Date", "Year")
          .measure("Income")
          .measure("Median Income")
          .measure("Weighted Median Income Rank")
          .measure("Weighted Median Income Decile")
          .measure("Weighted Median Income Total"),
        store.i18n.locale
      );

      q.cut(`[Date].[Year].&[${store.income_year}]`);
      return mondrianClient.query(q, "jsonrecords");
    })
    .then(res => {
      return {
        key: "income",
        data: {
          value: res.data.data[0]["Median Income"],
          decile: res.data.data[0]["Weighted Median Income Decile"],
          rank: res.data.data[0]["Weighted Median Income Rank"],
          total: res.data.data[0]["Weighted Median Income Total"],
          year: store.income_year,
          source: "NESI Survey"
        }
      };
    });

  return {
    type: "GET_DATA",
    promise: prm
  };
}

export function needGetPSUDatum(params, store) {
  const geo = getGeoObject(params);
  const prm = mondrianClient
    .cube("psu")
    .then(cube => {
      var q = geoCut(
        geo,
        "Geography",
        cube.query
          .drilldown("Date", "Year")
          .measure("Number of records")
          .measure("PSU Rank")
          .measure("PSU Average")
          .measure("PSU Rank Decile")
          .measure("PSU Rank Total"),
        store.i18n.locale
      );

      q.cut(`[Date].[Year].&[${sources.psu.year}]`);
      return mondrianClient.query(q, "jsonrecords");
    })
    .then(res => {
      return {
        key: "psu",
        data: {
          value: res.data.data[0]["PSU Average"],
          decile: res.data.data[0]["PSU Rank Decile"],
          rank: res.data.data[0]["PSU Rank"],
          total: res.data.data[0]["PSU Rank Total"],
          year: store.psu_year,
          source: "PSU data"
        }
      };
    });

  return {
    type: "GET_DATA",
    promise: prm
  };
}
