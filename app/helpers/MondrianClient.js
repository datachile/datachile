import { Client as MondrianClient } from "mondrian-rest-client";
import { getGeoObject, getLevelObject, getGeoType } from "helpers/dataUtils";

import flattenDeep from "lodash/flattenDeep";
import rangeRight from "lodash/rangeRight";

const client = new MondrianClient(__API__);

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

function setCaptionForLevelAndLang(query, level, lang) {
  const ann = level.annotations[`${lang}_caption`];
  if (ann) {
    query.caption(level.hierarchy.dimension.name, level.name, ann);
  }
  return query;
}

function setLangCaptions(query, lang) {
  // bail early if lang <> es
  if (lang.substring(0, 2) !== "es") return query;

  const drilldowns = query.getDrilldowns();

  (drilldowns || []).forEach(level => {
    query = setCaptionForLevelAndLang(query, level, lang);

    // when parents requested, also get their i18n'd captions
    if (query.options["parents"]) {
      rangeRight(1, level.depth).forEach(d => {
        const ancestor = level.hierarchy.levels.find(l => l.depth === d);
        query = setCaptionForLevelAndLang(query, ancestor, lang);
      });
    }
  });

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
  { drillDowns = [], options = {}, cuts = [] },
  overrideGeo = false
) {
  return (params, store) => {
    let geo = overrideGeo || getGeoObject(params);

    if (
      [
        "death_causes",
        "disabilities",
        "health_access",
        "nene_quarter"
      ].includes(cube) &&
      geo.type === "comuna"
    ) {
      geo = { ...geo.ancestor };
    }

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
          __API__ +
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
          __API__ +
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

function getGeoMembersDimension(
  key,
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] }
) {
  return (params, store) => {
    let geo = getGeoObject(params);

    const prm = client
      .cube(cube)
      .then(cube => {
        const q = createFreshQuery(cube, measures, {
          drillDowns: drillDowns,
          options: options,
          cuts: cuts
        });
        var query = geoCut(geo, "Geography", q, store.i18n.locale);
        return client.query(query);
      })
      .then(res => {
        if (res.data.values && res.data.values.length > 0) {
          const data = res.data || null;
          const level = drillDowns[0][2];
          const customKey = data.axis_dimensions.find(
            item => item.level === level
          ).level_depth;

          return {
            key: key,
            data: data.axes[customKey].members
              .map(item => item.name)
              .sort((a, b) => a - b)
          };
        } else {
          return {
            key: key,
            data: []
          };
        }
      });

    return {
      type: "GET_DATA",
      promise: prm
    };
  };
}

function simpleGeoDatumNeed(
  key,
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] },
  byValues = true,
  overrideGeo = false
) {
  return (params, store) => {
    let geo = overrideGeo ? overrideGeo : getGeoObject(params);

    if (cube === "health_access" && geo.type === "comuna") {
      geo = { ...geo.ancestor };
    }

    const prm = client
      .cube(cube)
      .then(cube => {
        const q = createFreshQuery(cube, measures, {
          drillDowns: drillDowns,
          options: options,
          cuts: cuts
        });

        var query = geoCut(geo, "Geography", q, store.i18n.locale);

        return byValues
          ? client.query(query)
          : client.query(query, "jsonrecords");
      })
      .then(res => {
        return {
          key: key,
          data: byValues
            ? flattenDeep(res.data.values)
            : flattenDeep(res.data.data)
        };
      });

    return {
      type: "GET_DATA",
      promise: prm
    };
  };
}

function createFreshQuery(
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] }
) {
  const q = cube.query;

  measures.forEach(m => {
    q.measure(m);
  });
  drillDowns.forEach(([...dd]) => {
    q.drilldown(...dd);
  });
  Object.entries(options).forEach(([k, v]) => q.option(k, v));
  cuts.forEach(c => q.cut(c));

  return q;
}

/* Receive params and make a query. If zero results make another query with ancestors' information and add a suffix "_region" to the given key. */
function simpleFallbackGeoDatumNeed(
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
        const q = createFreshQuery(cube, measures, {
          drillDowns: drillDowns,
          options: options,
          cuts: cuts
        });
        var query = geoCut(geo, "Geography", q, store.i18n.locale);
        return client.query(query);
      })
      .then(res => {
        if (res.data.values && res.data.values.length > 0) {
          return {
            key: key,
            data: { data: flattenDeep(res.data.values), fallback: false }
          };
        } else {
          return client
            .cube(cube)
            .then(cube => {
              const q = createFreshQuery(cube, measures, {
                drillDowns: drillDowns,
                options: options,
                cuts: cuts
              });
              var query = geoCut(
                geo.ancestor,
                "Geography",
                q,
                store.i18n.locale
              );
              return client.query(query);
            })
            .then(res => {
              return {
                key: key,
                data: { data: flattenDeep(res.data.values), fallback: true }
              };
            });
        }
      });

    return {
      type: "GET_DATA",
      promise: prm
    };
  };
}

/* Receive params and make a query. If zero results set available: false */
function simpleAvailableGeoDatumNeed(
  key,
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] },
  byValues = true
) {
  return (params, store) => {
    const geo = getGeoObject(params);

    const prm = client
      .cube(cube)
      .then(cube => {
        const q = createFreshQuery(cube, measures, {
          drillDowns: drillDowns,
          options: options,
          cuts: cuts
        });
        var query = geoCut(geo, "Geography", q, store.i18n.locale);
        return byValues
          ? client.query(query)
          : client.query(query, "jsonrecords");
      })
      .then(res => {
        if (
          (res.data.values && res.data.values.length > 0) ||
          (res.data.data && res.data.data.length > 0)
        ) {
          return {
            key: key,
            data: {
              data: byValues
                ? flattenDeep(res.data.values)
                : flattenDeep(res.data.data),
              available: true
            }
          };
        } else {
          return {
            key: key,
            data: { data: [], available: false }
          };
        }
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
  { drillDowns = [], options = {}, cuts = [] },
  byValues = true
) {
  return (params, store) => {
    const industry = getLevelObject(params);
    if (cube !== "tax_data") {
      industry.level2 = false;
    }
    const prm = client
      .cube(cube)
      .then(cube => {
        const q = createFreshQuery(cube, measures, {
          drillDowns: drillDowns,
          options: options,
          cuts: cuts
        });

        var query = levelCut(
          industry,
          "ISICrev4",
          "ISICrev4",
          q,
          "Level 1",
          "Level 2",
          store.i18n.locale
        );
        return byValues
          ? client.query(query)
          : client.query(query, "jsonrecords");
      })
      .then(res => {
        return {
          key: key,
          data: byValues
            ? flattenDeep(res.data.values)
            : flattenDeep(res.data.data)
        };
      });

    return {
      type: "GET_DATA",
      promise: prm
    };
  };
}

function queryBuilder(query, params) {
  let i, item;

  for (i = 0; (item = params.measures[i]); i++) query = query.measure(item);

  for (i = 0; (item = params.drillDowns[i]); i++)
    query = query.drilldown.apply(query, item);

  for (i = 0; (item = params.cuts[i]); i++) {
    if ("string" != typeof item) {
      item = item.values.map(v => `${item.key}.&[${v}]`).join(",");
      if (item.indexOf("],[") > -1) item = "{" + item + "}";
    }
    query = query.cut(item);
  }

  for (item in params.options) query = query.option(item, params.options[item]);

  return setLangCaptions(query, params.locale);
}

function quickQuery(params) {
  params.measures = params.measures || [];
  params.drillDowns = params.drillDowns || [];
  params.cuts = params.cuts || [];
  params.options = params.options || {};
  params.locale = params.locale || "en";

  return client.cube(params.cube).then(cube => {
    const query = queryBuilder(cube.query, params);
    return client.query(query, params.format || "json");
  });
}

const CUBES_CUT_BASE = {
  getLevelDrilldown(cube, level) {
    return [].concat(this.hierarchies[cube], this.levels[level]);
  },
  getLevelCut(cube, params) {
    const cut = this.getCut(params);
    if (cut && cube in this.hierarchies) {
      const hierarchy = this.hierarchies[cube];
      return `[${hierarchy[0]}].[${hierarchy[1]}].${cut}`;
    }
  }
};

const getGeoCut = params => {
  const lvlRegion = (params.region || "").split("-").pop();
  const lvlComuna = (params.comuna || "").split("-").pop();
  if (lvlComuna || lvlRegion)
    return lvlComuna ? `[Comuna].&[${lvlComuna}]` : `[Region].&[${lvlComuna}]`;
};

const CUBES_CUT_GEO = {
  ...CUBES_CUT_BASE,
  getCut: getGeoCut,
  levels: {
    country: undefined,
    region: "Region",
    comuna: "Comuna"
  },
  hierarchies: {
    election_results_update: ["Geography", "Geography"]
  }
};

const getCountryCut = params => {
  const level1 = (params.level1 || "").split("-").pop();
  const level2 = (params.level2 || "").split("-").pop();
  return level2 ? `[Country].&[${level2}]` : `[Continent].&[${level1}]`;
};

const CUBES_CUT_COUNTRY = {
  ...CUBES_CUT_BASE,
  getCut: getCountryCut,
  levels: {
    level1: "Continent",
    level2: "Country"
  },
  hierarchies: {
    immigration: ["Origin Country", "Country"],
    exports: ["Destination Country", "Country"],
    imports: ["Origin Country", "Country"]
  }
};

function simpleGeoDatumNeed2(key, query, postprocess) {
  if ("function" != typeof postprocess) {
    postprocess = function(res, lang, params, store) {
      const data = res.data || {};
      return data.values ? flattenDeep(data.values) : data.data;
    };
  }

  return (params, store) => {
    const cube = query.cube;
    const levelCut = CUBES_CUT_GEO.getLevelCut(cube, params);

    query.locale = store.i18n.locale;
    query.cuts = [].concat(query.cuts, levelCut).filter(Boolean);

    if (query.drillLevel) {
      const ddlevel = CUBES_CUT_GEO.getLevelDrilldown(cube, getGeoType(params));
      query.drillDowns = [].concat(query.drillDowns, ddlevel);
    }

    const promise = quickQuery(query)
      .then(res => postprocess(res, query.locale, params, store))
      .then(data => ({ key, data }));

    return { type: "GET_DATA", promise, description: key };
  };
}

function simpleCountryDatumNeed(key, query, postprocess) {
  if ("function" != typeof postprocess) {
    postprocess = function(res, lang, params, store) {
      const data = res.data || {};
      return data.values ? flattenDeep(data.values) : data.data;
    };
  }

  return (params, store) => {
    const cube = query.cube;

    const countryCut = CUBES_CUT_COUNTRY.getLevelCut(cube, params);

    query.locale = store.i18n.locale;
    query.cuts = [].concat(query.cuts, countryCut).filter(Boolean);
    if (query.drillLevel) {
      const ddlevel = CUBES_CUT_COUNTRY.getLevelDrilldown(
        cube,
        params.level2 ? "level2" : "level1"
      );
      query.drillDowns = [].concat(query.drillDowns, ddlevel);
    }

    const promise = quickQuery(query)
      .then(res => postprocess(res, query.locale, params, store))
      .then(data => ({ key, data }));

    return { type: "GET_DATA", promise, description: key };
  };
}

function simpleDatumNeed(
  key,
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] },
  profile,
  byValues = true
) {
  return (params, store) => {
    let obj = {};
    if (profile !== "rd_survey") {
      obj = profile.includes("geo")
        ? getGeoObject(params)
        : getLevelObject(params);
    }

    if (
      ["death_causes", "disabilities", "health_access"].includes(cube) &&
      obj.type === "comuna"
    ) {
      obj = { ...obj.ancestor };
    }

    if (profile === "geo_by_region") {
      obj = { ...obj.ancestor };
    }

    const prm = client
      .cube(cube)
      .then(cube => {
        const q = createFreshQuery(cube, measures, {
          drillDowns: drillDowns,
          options: options,
          cuts: cuts
        });

        var query = [];

        // Add cuts in query
        switch (profile) {
          case "geo":
          case "geo_by_region":
            query = geoCut(obj, "Geography", q, store.i18n.locale);
            break;
          case "country":
            query = levelCut(
              obj,
              "Origin Country",
              "Country",
              q,
              "Continent",
              "Country",
              store.i18n.locale,
              false
            );
            break;
          case "industry":
            query = levelCut(
              obj,
              "ISICrev4",
              "ISICrev4",
              q,
              "Level 1",
              "Level 2",
              store.i18n.locale
            );
            break;
          case "product.export":
            query = levelCut(
              obj,
              "Export HS",
              "HS",
              q,
              "HS0",
              "HS2",
              store.i18n.locale
            );
            break;
          case "product.import":
            query = levelCut(
              obj,
              "Import HS",
              "HS",
              q,
              "HS0",
              "HS2",
              store.i18n.locale
            );
            break;
          case "no_cut":
          case "geo_no_cut":
            query = setLangCaptions(q, store.i18n.locale);
            break;
          case "rd_survey":
            query = setLangCaptions(q, store.i18n.locale);
            break;
        }

        return byValues
          ? client.query(query)
          : client.query(query, "jsonrecords");
      })
      .then(res => {
        if (
          (res.data.values && res.data.values.length > 0) ||
          (res.data.data && res.data.data.length > 0)
        ) {
          return {
            key: key,
            data: {
              data: byValues
                ? flattenDeep(res.data.values)
                : flattenDeep(res.data.data),
              available: true
            }
          };
        } else {
          return {
            key: key,
            data: { data: [], available: false }
          };
        }
      });

    return {
      type: "GET_DATA",
      promise: prm
    };
  };
}

function simpleInstitutionDatumNeed(
  key,
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] }
) {
  return (params, store) => {
    const institution = getLevelObject(params);
    const prm = client
      .cube(cube)
      .then(cube => {
        const query = levelCut(
          institution,
          "Higher Institutions",
          "Higher Institutions",
          cube.query
            .option("parents", true)
            .drilldown("Careers", "Careers", "Career")
            .drilldown("Accreditations", "Accreditations", "Accreditation")
            .measure("Number of records"),
          "Higher Institution Subgroup",
          "Higher Institution",
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
  getGeoCut,
  getCountryCut,
  simpleGeoChartNeed,
  simpleIndustryChartNeed,
  simpleGeoDatumNeed,
  simpleFallbackGeoDatumNeed,
  simpleAvailableGeoDatumNeed,
  simpleGeoDatumNeed2,
  simpleCountryDatumNeed,
  simpleIndustryDatumNeed,
  simpleInstitutionDatumNeed,
  getGeoMembersDimension,
  simpleDatumNeed,
  quickQuery,
  queryBuilder
};
export default client;
