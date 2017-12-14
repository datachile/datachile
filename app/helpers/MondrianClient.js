import { Client as MondrianClient } from "mondrian-rest-client";
import { getGeoObject, getLevelObject } from "helpers/dataUtils";

import flattenDeep from "lodash/flattenDeep";

const client = new MondrianClient("https://chilecube.datawheel.us/");
//const client = new MondrianClient("http://localhost:9292/");

/**
 * Returns the provided query with the appropiate cut
 * applied according to the provided geo region.
 * @param {} geo
 * @param {} dimensionName
 * @param {} query
 */
function geoCut(geo, dimensionName, query, lang = "en") {
  query = setLangCaptions(query, lang);

  if (geo.type === "country") {
    return query; // no region provided, don't cut
  } else if (geo.type === "region") {
    //query.drilldown(dimensionName, "Region");
    return query.cut(`[${dimensionName}].[Region].&[${geo.key}]`);
  } else if (geo.type === "comuna") {
    //query.drilldown(dimensionName, "Comuna");
    return query.cut(`[${dimensionName}].[Comuna].&[${geo.key}]`);
  } else {
    throw new Error(`Geo '${geo}' unknown`);
  }
}

function levelCut(
  object,
  dimensionName,
  hierarchyName,
  query,
  level1,
  level2,
  lang = "en",
  drilldown = true
) {
  query = setLangCaptions(query, lang);
  if (object.level2 === false) {
    if (drilldown) query.drilldown(dimensionName, hierarchyName, level1);
    return query.cut(
      `[${dimensionName}].[${hierarchyName}].[${level1}].&[${object.level1}]`
    );
  } else {
    if (drilldown) query.drilldown(dimensionName, hierarchyName, level2);
    return query.cut(
      `[${dimensionName}].[${hierarchyName}].[${level2}].&[${object.level2}]`
    );
  }
}

function setLangCaptions(query, lang) {
  if (lang.substring(0, 2) == "es") {
    const drilldowns = query.getDrilldowns();

    drilldowns.forEach(level => {
      const es = level.annotations["es_caption"];
      if (es) {
        query.caption(level.hierarchy.dimension.name, level.name, es);
      }
    });
  }
  return query;
}

function getLocaleCaption(level, locale = "en") {
  const caption = level.annotations[locale.substring(0, 2) + "_caption"];
  if (caption) {
    return caption;
  }
  return null;
}

function getMeasureByGeo(type, countryM, regionM, comunaM) {
  return type == "country" ? countryM : type == "region" ? regionM : comunaM;
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

function simpleGeoChartNeed(
  key,
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] }
) {
  return (params, store) => {
    const geo = getGeoObject(params);

    const prm = client.cube(cube).then(cube => {
      const q = cube.query;
      measures.forEach(m => {
        q.measure(m);
      });
      drillDowns.forEach(([...dd]) => {
        q.drilldown(...dd);
      });
      Object.entries(options).forEach(([k, v]) => q.option(k, v));
      cuts.forEach(c => q.cut(c));

      return {
        key: key,
        data:
          store.env.CANON_API +
          geoCut(geo, "Geography", q, store.i18n.locale).path("jsonrecords")
      };
    });

    return {
      type: "GET_DATA",
      promise: prm
    };
  };
}

function simpleIndustryChartNeed(
  key,
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] }
) {
  return (params, store) => {
    const industry = getLevelObject(params);
    industry.level2 = false;
    const prm = client.cube(cube).then(cube => {
      const q = cube.query;
      measures.forEach(m => {
        q.measure(m);
      });
      drillDowns.forEach(([...dd]) => {
        q.drilldown(...dd);
      });
      Object.entries(options).forEach(([k, v]) => q.option(k, v));
      cuts.forEach(c => q.cut(c));

      return {
        key: key,
        data:
          store.env.CANON_API +
          levelCut(
            industry,
            "ISICrev4",
            "ISICrev4",
            q,
            "Level 1",
            "Level 2",
            store.i18n.locale
          ).path("jsonrecords")
      };
    });

    return {
      type: "GET_DATA",
      promise: prm
    };
  };
}

function simpleDatumNeed(
  key,
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] }
) {
  return (params, store) => {
    const geo = getGeoObject(params);

    const prm = client
      .cube(cube)
      .then(cube => {
        const q = cube.query;

        measures.forEach(m => {
          q.measure(m);
        });
        drillDowns.forEach(([...dd]) => {
          q.drilldown(...dd);
        });
        Object.entries(options).forEach(([k, v]) => q.option(k, v));
        cuts.forEach(c => q.cut(c));

        var query = geoCut(geo, "Geography", q, store.i18n.locale);
        return client.query(query);
      })
      .then(res => {
        return {
          key: key,
          data: flattenDeep(res.data.values)
        };
      });

    return {
      type: "GET_DATA",
      promise: prm
    };
  };
}

function simpleIndustryDatumNeed(
  key,
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] }
) {
  return (params, store) => {
    var industry = getLevelObject(params);
    industry.level2 = false;
    const prm = client
      .cube(cube)
      .then(cube => {
        const q = cube.query;

        measures.forEach(m => {
          q.measure(m);
        });
        drillDowns.forEach(([...dd]) => {
          q.drilldown(...dd);
        });
        Object.entries(options).forEach(([k, v]) => q.option(k, v));
        cuts.forEach(c => q.cut(c));

        var query = levelCut(
          industry,
          "ISICrev4",
          "ISICrev4",
          q,
          "Level 1",
          "Level 2",
          store.i18n.locale
        );
        return client.query(query);
      })
      .then(res => {
        return {
          key: key,
          data: flattenDeep(res.data.values)
        };
      });

    return {
      type: "GET_DATA",
      promise: prm
    };
  };
}

function simpleCountryDatumNeed(
  key,
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] }
) {
  return (params, store) => {
    const geo = getLevelObject(params);

    const prm = client
      .cube(cube)
      .then(cube => {
        const q = cube.query;

        measures.forEach(m => {
          q.measure(m);
        });
        drillDowns.forEach(([...dd]) => {
          q.drilldown(...dd);
        });
        Object.entries(options).forEach(([k, v]) => q.option(k, v));
        cuts.forEach(c => q.cut(c));

        var query = levelCut(
          geo,
          "Origin Country",
          "Country",
          q,
          "Subregion",
          "Country",
          store.i18n.locale,
          false
        );
        return client.query(query);
      })
      .then(res => {
        return {
          key: key,
          data: flattenDeep(res.data.values)
        };
      });

    return {
      type: "GET_DATA",
      promise: prm
    };
  };
}

export {
  levelCut,
  geoCut,
  getLocaleCaption,
  getMembersQuery,
  getMemberQuery,
  setLangCaptions,
  getMeasureByGeo,
  simpleGeoChartNeed,
  simpleIndustryChartNeed,
  simpleDatumNeed,
  simpleCountryDatumNeed,
  simpleIndustryDatumNeed
};
export default client;
