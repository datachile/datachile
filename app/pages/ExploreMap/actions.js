import { fullNameToArray } from "helpers/formatters";
import shorthash from "helpers/shorthash";
import mondrianClient, {
  getLocaleCaption,
  queryBuilder
} from "helpers/MondrianClient";

export function requestData(params) {
  const { cubeName, cuts, locale } = params;
  return function(dispatch) {
    dispatch({ type: "MAP_DATA_FETCH", payload: params });

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
            locale: locale
          });

        const queryComunas =
          drilldownsGeo.comuna &&
          queryBuilder(cube.query, {
            measures: measures,
            drillDowns: [drilldownYear, drilldownsGeo.comuna].filter(Boolean),
            cuts: cuts,
            options: { parents: false },
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
          type: "MAP_DATA_SUCCESS",
          payload: {
            queryRegion: results[0] && results[0].url,
            queryComuna: results[1] && results[1].url,
            dataRegion: results[0] && results[0].data.data,
            dataComuna: results[1] && results[1].data.data
          }
        });
      })
      .then(null, function(err) {
        return dispatch({ type: "MAP_DATA_ERROR", payload: err.stack });
      });
  };
}

export function requestMembers(cubeName, locale = "en") {
  return function(dispatch) {
    dispatch({ type: "MAP_MEMBER_FETCH", payload: cubeName });

    // by this point the cube should be in cache already
    return mondrianClient
      .cube(cubeName)
      .then(cube => {
        const availableDims = cube.annotations.available_dimensions
          ? cube.annotations.available_dimensions.split(",")
          : [];

        const requestsLevels = cube.dimensions.reduce((requests, dim) => {
          if (
            !/Geography$|^Date$/.test(dim.name) &&
            availableDims.indexOf(dim.name) > -1
          ) {
            for (let hier, i = 0; (hier = dim.hierarchies[i]); i++) {
              let hashSelector = shorthash(`[${dim.name}].[${hier.name}]`);

              for (let level, j = 1; (level = hier.levels[j]); j++) {
                let hashLevel = shorthash(level.name);
                let caption = getLocaleCaption(level, locale);

                let promise = mondrianClient
                  .members(level, false, caption)
                  .then(members => {
                    dispatch({ type: "MAP_MEMBER_LOADED" });
                    return {
                      name: `[${cube.name}].${level.fullName}`,
                      members: members.reduce((output, member) => {
                        if (member.caption)
                          output.push({
                            hash: shorthash(`${member.key}`),
                            hsel: hashSelector,
                            hlvl: hashLevel,
                            fullName: `${level.fullName}.&[${member.key}]`,
                            value: member.name,
                            name: member.caption
                          });
                        return output;
                      }, [])
                    };
                  });
                requests.push(promise);
              }
            }
          }
          return requests;
        }, []);

        dispatch({
          type: "MAP_MEMBER_LOADING",
          payload: requestsLevels.length
        });

        return Promise.all(requestsLevels);
      })
      .then(levels =>
        dispatch({
          type: "MAP_MEMBER_SUCCESS",
          payload: { cube: cubeName, levels }
        })
      )
      .then(null, err => dispatch({ type: "MAP_MEMBER_ERROR", payload: err }));
  };
}

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
  return { type: "MAP_YEAR_OPTIONS", payload };
}
