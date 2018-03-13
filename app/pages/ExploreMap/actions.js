import { fullNameToArray } from "helpers/formatters";
import shorthash from "helpers/shorthash";
import mondrianClient, {
  getLocaleCaption,
  queryBuilder
} from "helpers/MondrianClient";

export function requestData(params) {
  const { cubeName, cuts, locale } = params;
  return function(dispatch) {
    dispatch({ type: "MAP_DATA_FETCH" });

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
        return dispatch({ type: "MAP_DATA_ERROR", payload: err });
      });
  };
}

export function requestMembers(cubeName, locale = "en") {
  return function(dispatch) {
    dispatch({ type: "MAP_MEMBER_FETCH" });

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
              for (let level, j = 1; (level = hier.levels[j]); j++) {
                let caption = getLocaleCaption(level, locale);
                let promise = mondrianClient
                  .members(level, false, caption)
                  .then(members => ({
                    name: `[${cube.name}].${level.fullName}`,
                    members: members.reduce((output, member) => {
                      if (member.caption)
                        output.push({
                          hash: shorthash(`${member.key}`),
                          fullName: `${level.fullName}.&[${member.key}]`,
                          value: member.name,
                          name: member.caption
                        });
                      return output;
                    }, [])
                  }));
                requests.push(promise);
              }
            }
          }
          return requests;
        }, []);

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

export function serializeCuts(obj) {
  return Object.keys(obj).reduce((output, key) => {
    const cuts = obj[key].map(cut => cut.fullName);
    return output.concat(cuts);
  }, []);
}

function serializeObject(obj) {
  return Object.keys(obj).reduce(function(output, key) {
    const value = [].concat(obj[key]).reduce((hashes, item) => {
      if (item && item.hash) hashes.push(item.hash);
      return hashes;
    }, []);

    if (value.length > 0) {
      output.push(`${shorthash(key)}_${value.join(".")}`);
    }

    return output;
  }, []);
}

function unserializeObject(arr) {
  return arr.filter(Boolean).reduce(function(output, item) {
    item = item.split("_");
    const hash = item[0];
    const value = item[1].split(".").filter(Boolean);
    return output;
  }, {});
}

export function stateToPermalink(params) {
  const permalink = {};

  if (params.topic && params.measure) {
    permalink.t = params.topic.hash;
    permalink.m = params.measure.hash;
    permalink.c = serializeObject(params.cuts).join("-");
    permalink.l = params.level == "region" ? "r" : "c";
    permalink.sc = params.scale == "log" ? "log" : "lin";
    permalink.s = serializeObject(params.selector).join("-");
    permalink.y = params.year;

    if (!permalink.c) delete permalink.c;
    if (!permalink.s) delete permalink.s;
  }

  return (
    "?" +
    Object.keys(permalink)
      .filter(key => permalink[key])
      .map(key => `${key}=${permalink[key]}`)
      .join("&")
  );
}

export function permalinkToState(permalink, topics, measures, hierarchies) {
  const parsed = (permalink || "")
    .replace("?", "")
    .split("&")
    .reduce((obj, item) => {
      const tokens = item.split("=");
      // if ('s' == tokens[0] || 'c' == tokens[0])
      // tokens[1] = unserializeObject(tokens[1].split('-'));
      obj[tokens[0]] = tokens[1];
      return obj;
    }, {});

  // console.log(parsed, hierarchies);

  permalink = {
    topic: topics.find(topic => topic.hash == parsed.t),
    measure: Object.keys(measures).reduce((match, key) => {
      return match || measures[key].find(ms => ms.hash == parsed.m);
    }, null)
    // cuts: {},
    // selector: {},
  };

  if (parsed.y) permalink.year = parsed.y;
  if (parsed.sc) permalink.scale = parsed.sc == "lin" ? "linear" : "log";
  if (parsed.l) permalink.level = parsed.l == "c" ? "comuna" : "region";

  return permalink;
}
