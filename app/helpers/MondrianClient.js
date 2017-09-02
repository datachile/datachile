import { Client as MondrianClient } from "mondrian-rest-client";

console.log("HARCODED!!!! REMOVE!!!");

/*const client = new MondrianClient(
  typeof window == "undefined"
    ? process.env.CANON_API
    : "http://chilecube.datawheel.us/"
);*/
const client = new MondrianClient("http://localhost:9292/");
//const client = new MondrianClient("http://chilecube.datawheel.us/");

/**
 * Returns the provided query with the appropiate cut
 * applied according to the provided geo region.
 * @param {} geo
 * @param {} dimensionName
 * @param {} query
 */
function geoCut(geo, dimensionName, query, lang = "en") {
  //if(lang!=CANON_LANGUAGE_DEFAULT){
  if (lang.substring(0, 2) == "es") {
    const drilldowns = query.getDrilldowns();

    drilldowns.forEach(level => {
      const es = level.annotations["es_caption"];
      if (es) {
        query.caption(level.hierarchy.dimension.name, level.name, es);
      }
    });
  }

  if (geo.type === "country") {
    return query; // no region provided, don't cut
  } else if (geo.type === "region") {
    query.drilldown(dimensionName, "Region");
    return query.cut(`[${dimensionName}].[Region].&[${geo.key}]`);
  } else if (geo.type === "comuna") {
    query.drilldown(dimensionName, "Comuna");
    return query.cut(`[${dimensionName}].[Comuna].&[${geo.key}]`);
  } else {
    throw new Error(`Geo '${geo}' unknown`);
  }
}

function getLocaleCaption(level, locale = "en") {
  const caption = level.annotations[locale.substring(0, 2) + "_caption"];
  if (caption) {
    return caption;
  }
  return null;
}

function getMembersQuery(
  cube,
  dimension,
  level,
  locale = "en",
  children = false
) {
  return client
    .cube(cube)
    .then(cube => {
      return cube.dimensionsByName[dimension].hierarchies[0].getLevel(level);
    })
    .then(level => {
      return client.members(level, children, getLocaleCaption(level, locale));
    });
}

function getMemberQuery(cube, dimension, level, key, locale = "en") {
  return client
    .cube(cube)
    .then(cube => {
      var h = cube.dimensionsByName[dimension].hierarchies[0];

      return h.getLevel(level);
    })
    .then(level => {
      return client.member(level, key, false, getLocaleCaption(level, locale));
    });
}

export { geoCut, getLocaleCaption, getMembersQuery, getMemberQuery };
export default client;
