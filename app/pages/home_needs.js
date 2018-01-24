import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { slugifyItem, getImageFromMember } from "helpers/formatters";

export function needHomeComunasPopulation(params, store) {
  const prm = mondrianClient
    .cube("population_estimate")
    .then(cube => {
      var q = cube.query
        .drilldown("Geography", "Geography", "Comuna")
        .measure("Population")
        .option("parents", true)
        .cut(`[Date].[Year].&[${sources.population_estimate.year}]`);

      return mondrianClient.query(
        setLangCaptions(q, store.i18n.locale),
        "jsonrecords"
      );
    })
    .then(res => {
      return {
        key: "home_comunas_population",
        data: res.data.data
          .sort((a, b) => {
            return a["Population"] < b["Population"] ? 1 : -1;
          })
          .map(r => {
            return {
              name: r["Comuna"],
              type: "comuna",
              url: slugifyItem(
                "geo",
                r["ID Region"],
                r["Region"],
                r["ID Comuna"],
                r["Comuna"]
              ),
              img: getImageFromMember("geo", r["ID Region"], r["ID Comuna"])
            };
          })
      };
    });

  return {
    type: "GET_DATA",
    promise: prm
  };
}
export function needHomeComunasExports(params, store) {
  const prm = mondrianClient
    .cube("exports")
    .then(cube => {
      var q = cube.query
        .drilldown("Geography", "Geography", "Comuna")
        .measure("FOB US")
        .option("parents", true)
        .cut(`[Date].[Year].&[${sources.exports.year}]`);

      return mondrianClient.query(
        setLangCaptions(q, store.i18n.locale),
        "jsonrecords"
      );
    })
    .then(res => {
      return {
        key: "home_comunas_exports",
        data: res.data.data
          .sort((a, b) => {
            return a["FOB US"] < b["FOB US"] ? 1 : -1;
          })
          .map(r => {
            return {
              name: r["Comuna"],
              type: "comuna",
              url: slugifyItem(
                "geo",
                r["ID Region"],
                r["Region"],
                r["ID Comuna"],
                r["Comuna"]
              ),
              img: getImageFromMember("geo", r["ID Region"], r["ID Comuna"])
            };
          })
      };
    });

  return {
    type: "GET_DATA",
    promise: prm
  };
}
export function needHomeProductsExports(params, store) {
  const prm = mondrianClient
    .cube("exports")
    .then(cube => {
      var q = cube.query
        .drilldown("Export HS", "HS", "HS2")
        .measure("FOB US")
        .option("parents", true)
        .cut(`[Date].[Year].&[${sources.exports.year}]`);

      return mondrianClient.query(
        setLangCaptions(q, store.i18n.locale),
        "jsonrecords"
      );
    })
    .then(res => {
      return {
        key: "home_products_exports",
        data: res.data.data
          .sort((a, b) => {
            return a["FOB US"] < b["FOB US"] ? 1 : -1;
          })
          .map(r => {
            return {
              name: r["HS2"],
              type: "products",
              url: slugifyItem(
                "products",
                r["ID HS0"],
                r["HS0"],
                r["ID HS2"],
                r["HS2"]
              ),
              img: getImageFromMember("products", r["ID HS0"], r["ID HS2"])
            };
          })
      };
    });

  return {
    type: "GET_DATA",
    promise: prm
  };
}
export function needHomeCountriesExports(params, store) {
  const prm = mondrianClient
    .cube("exports")
    .then(cube => {
      var q = cube.query
        .drilldown("Destination Country", "Country", "Country")
        .measure("FOB US")
        .option("parents", true)
        .cut(`[Date].[Year].&[${sources.exports.year}]`);

      return mondrianClient.query(
        setLangCaptions(q, store.i18n.locale),
        "jsonrecords"
      );
    })
    .then(res => {
      return {
        key: "home_countries_exports",
        data: res.data.data
          .sort((a, b) => {
            return a["FOB US"] < b["FOB US"] ? 1 : -1;
          })
          .map(r => {
            return {
              name: r["Country"],
              type: "countries",
              url: slugifyItem(
                "countries",
                r["ID Continent"],
                r["Continent"],
                r["ID Country"],
                r["Country"]
              ),
              img: "/images/profile-bg/country/" + r["ID Country"] + ".jpg"
            };
          })
      };
    });

  return {
    type: "GET_DATA",
    promise: prm
  };
}
