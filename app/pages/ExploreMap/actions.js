import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

export default function requestData(params) {
  const { cubeName, cuts, locale } = params;
  return function(dispatch) {
    return mondrianClient
      .cube(cubeName)
      .then(function(cube) {
        const measures = cube.measures.map(ms => ms.name);
        const drilldownYear = getYearDrilldown(cube.dimensions);
        const drilldownsGeo = getGeoDrilldowns(cube.dimensions);

        const queryRegiones =
          drilldownsGeo.region &&
          queryBuilder(cube.query, {
            measures: measures,
            drillDowns: [drilldownYear, drilldownsGeo.region].filter(Boolean),
            cuts: cuts,
            options: { parents: false },
            format: "jsonrecords",
            locale: locale
          });

        const queryComunas =
          drilldownsGeo.comuna &&
          queryBuilder(cube.query, {
            measures: measures,
            drillDowns: [drilldownYear, drilldownsGeo.comuna].filter(Boolean),
            cuts: cuts,
            options: { parents: false },
            format: "jsonrecords",
            locale: locale
          });

        return Promise.all([
          queryRegiones && mondrianClient.query(queryRegiones, "jsonrecords"),
          queryComunas && mondrianClient.query(queryComunas, "jsonrecords")
        ]);
      })
      .then(results => {
        const data = results[0] ? results[0].data.data : [];
        if (data[0] && "Year" in data[0]) dispatch(getAvailableYears(data));

        return dispatch({
          type: "MAP_NEW_RESULTS",
          payload: {
            queryRegion: results[0] && results[0].url,
            queryComuna: results[1] && results[1].url,
            dataRegion: results[0] && results[0].data.data,
            dataComuna: results[1] && results[1].data.data
          }
        });
      });
  };
}

export function queryBuilder(query, params) {
  let i, item;

  for (i = 0; (item = params.measures[i]); i++) query = query.measure(item);

  for (i = 0; (item = params.drillDowns[i]); i++)
    query = query.drilldown.apply(query, item);

  for (i = 0; (item = params.cuts[i]); i++) {
    if ("string" != typeof item)
      item = "{" + item.values.map(v => `${item.key}.&[${v}]`).join(",") + "}";
    query = query.cut(item);
  }

  for (item in params.options) query = query.option(item, params.options[item]);

  setLangCaptions(query, params.locale);

  return query;
}

const fullNameToArray = fullName =>
  fullName && fullName.slice(1, -1).split("].[");

function getGeoDrilldowns(dimensions) {
  return dimensions.reduce(
    function(output, dim) {
      const hierarchy = dim.hierarchies.find(hie => hie.name == "Geography");

      if (hierarchy) {
        const lvlRegion = hierarchy.levels.find(lvl => lvl.name == "Region");
        if (lvlRegion) output.region = fullNameToArray(lvlRegion.fullName);

        const lvlComuna = hierarchy.levels.find(lvl => lvl.name == "Comuna");
        if (lvlComuna) output.comuna = fullNameToArray(lvlComuna.fullName);
      }

      return output;
    },
    { region: undefined, comuna: undefined }
  );
}

function getYearDrilldown(dimensions) {
  return dimensions.reduce(function(output, dim) {
    const hierarchy = dim.hierarchies.find(hie => hie.name == "Date");
    if (hierarchy) output = fullNameToArray(hierarchy.levels[1].fullName);
    return output;
  }, undefined);
}

function getAvailableYears(data) {
  return function(dispatch) {
    // make a map of years
    const years = data.reduce(function(output, d) {
      const year = d["Year"];
      output[year] = true;
      return output;
    }, {});
    // remove the undefined key just in case
    delete years.undefined;
    // get an array of keys
    const payload = Object.keys(years).sort();
    // save
    return dispatch({ type: "MAP_YEAR_OPTIONS", payload });
  };
}
