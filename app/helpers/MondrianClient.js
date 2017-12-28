import { Client as MondrianClient } from "mondrian-rest-client";
import { getGeoObject, getLevelObject } from "helpers/dataUtils";

import flattenDeep from "lodash/flattenDeep";

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

function setLangCaptions(query, lang) {
  if (lang.substring(0, 2) == "es") {
    const drilldowns = query.getDrilldowns();

    (drilldowns || []).forEach(level => {
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
  { drillDowns = [], options = {}, cuts = [] },
  overrideGeo = false
) {
  return (params, store) => {
    let geo = overrideGeo ? overrideGeo : getGeoObject(params);

    if (
      ["death_causes", "disabilities", "health_access"].includes(cube) &&
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

function simpleCountryDatumNeed(
  key,
  {
    cube,
    measures = [],
    drillDowns = [],
    cuts = [],
    options = {},
    format = null
  }
) {
  return (params, store) => {
    const geo = getLevelObject(params);

    const prm = client
      .cube(cube)
      .then(cube => {
        const q = cube.query;

        measures.forEach(q.measure, q);
        drillDowns.forEach(dd => q.drilldown(...dd));
        cuts
          .map(function(cut) {
            return "string" == typeof cut
              ? cut
              : "{" + cut.values.map(v => `${cut.key}.&[${v}]`).join(",") + "}";
          })
          .forEach(q.cut, q);
        Object.entries(options).forEach(pairs => q.option(...pairs));

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

        return client.query(query, format);
      })
      .then(res => {
        const data = res.data || {};
        return {
          key: key,
          data: data.data || flattenDeep(data.values)
        };
      });

    return {
      type: "GET_DATA",
      promise: prm
    };
  };
}

const getCountryCut = params => {
  const level1 = (params.level1 || "").split("-").pop();
  const level2 = (params.level2 || "").split("-").pop();
  return level2 ? `[Country].&[${level2}]` : `[Subregion].&[${level1}]`;
};

function simpleDatumNeed(
  key,
  cube,
  measures,
  { drillDowns = [], options = {}, cuts = [] },
  profile,
  byValues = true
) {
  return (params, store) => {
    let obj = profile === "geo" ? getGeoObject(params) : getLevelObject(params);

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
            query = geoCut(obj, "Geography", q, store.i18n.locale);
            break;
          case "country":
            query = levelCut(
              obj,
              "Origin Country",
              "Country",
              q,
              "Subregion",
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
        const q = createFreshQuery(cube, measures, {
          drillDowns: drillDowns,
          options: options,
          cuts: cuts
        });

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
  getCountryCut,
  simpleGeoChartNeed,
  simpleIndustryChartNeed,
  simpleGeoDatumNeed,
  simpleFallbackGeoDatumNeed,
  simpleAvailableGeoDatumNeed,
  simpleCountryDatumNeed,
  simpleIndustryDatumNeed,
  simpleInstitutionDatumNeed,
  getGeoMembersDimension,
  simpleDatumNeed
};
export default client;
