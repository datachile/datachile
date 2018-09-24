import { nest } from "d3-collection";
import { slugifyStr } from "helpers/formatters";
import shorthash from "helpers/shorthash";
import mondrianClient from "helpers/MondrianClient";

export function mapCommonNeed(params, store) {
  const hasGeoDimensions = dimensions =>
    dimensions.length > 0 &&
    dimensions.some(
      dim =>
        dim.hierarchies.length > 0 &&
        dim.hierarchies.some(hie => hie.name == "Geography")
    );

  const localeCaption = function(key, item) {
    return item.annotations[key] || item.caption || item.name;
  }.bind(null, `${store.i18n.locale}_element_caption`);

  const promise = mondrianClient.cubes().then(cubes => {
    const hierarchies = {};
    const measures = {};

    for (let cube, i = 0; (cube = cubes[i]); i++) {
      if (!hasGeoDimensions(cube.dimensions)) continue;

      const topic = cube.annotations.topic;
      const availableMs = cube.annotations.available_measures
        ? cube.annotations.available_measures.split(",")
        : [];

      measures[topic] = [].concat(
        measures[topic] || [],
        cube.measures
          .filter(ms => availableMs.indexOf(ms.name) > -1)
          .map(ms => ({
            hash: shorthash(ms.name),
            cube: cube.name,
            value: ms.name,
            name: localeCaption(ms),
            format: ms.annotations.es_format || "0.[00] a"
          }))
      );

      let selectors = [];

      const availableDims = cube.annotations.available_dimensions
        ? cube.annotations.available_dimensions.split(",")
        : [];

      for (let dim, j = 0; (dim = cube.dimensions[j]); j++) {
        if (
          !/Geography$|^Date$/.test(dim.name) &&
          availableDims.indexOf(dim.name) > -1
        ) {
          for (let hier, k = 0; (hier = dim.hierarchies[k]); k++) {
            selectors.push({
              hash: shorthash(`[${dim.name}].[${hier.name}]`),
              cube: cube.name,
              name: localeCaption(dim),
              value: `[${dim.name}].[${hier.name}]`,
              isGeo: /country/i.test(dim.name),
              levels: hier.levels.slice(1).map(lvl => ({
                hash: shorthash(lvl.name),
                value: lvl.fullName,
                name: localeCaption(lvl)
              }))
            });
          }
        }
      }

      hierarchies[cube.name] = selectors;
    }

    return {
      key: "map_params",
      data: {
        selectors: hierarchies,
        measures: measures
      }
    };
  });

  return { type: "GET_DATA", promise };
}

function flatDatasetCols(dataset, type) {
  const indicatorSlug = slugifyStr(dataset.title, "_");
  const region = type == "region";

  var localFlattenedFields = {};

  return {
    data: nest()
      .key(function(d) {
        return region ? d["ID Region"] : d["ID Comuna"];
      })
      .rollup(function(leaves) {
        return leaves.reduce((record, param) => {
          const field = indicatorSlug + "_" + param["ID Year"];
          localFlattenedFields[field] = true;
          record.entidad_nombre = region ? param["Region"] : param["Comuna"];
          record.entidad_id = region ? param["ID Region"] : param["ID Comuna"];
          record.entidad_tipo = region ? "region" : "comuna";
          record[field] = param[dataset.indicator];
          return record;
        }, {});
      })
      .entries(dataset.data[type].data)
      .map(d => d.value),
    fields: localFlattenedFields
  };
}

function flatDatasetRows(dataset, type) {
  const indicatorSlug = slugifyStr(dataset.title, "_");
  const region = type == "region";

  var localFlattenedFields = { anio: true };

  localFlattenedFields[indicatorSlug] = true;

  return {
    data: dataset.data[type].data.map(d => {
      var record = {};
      record.entidad_nombre = region ? d["Region"] : d["Comuna"];
      record.entidad_id = region ? d["ID Region"] : d["ID Comuna"];
      record.entidad_tipo = region ? "region" : "comuna";
      record.anio = d["ID Year"];
      record[indicatorSlug] = d[dataset.indicator];
      return record;
    }),
    fields: localFlattenedFields
  };
}

export function combineAndFlatDatasets(datasets, pivot = "cols") {
  var flattenedDatasets = [];

  var flattenedFields = {
    entidad_tipo: true,
    entidad_nombre: true,
    entidad_id: true
  };

  const typesAvailable = [...new Set(datasets.map(item => item.level))];

  datasets.forEach(dataset => {
    typesAvailable.forEach(type => {
      if (dataset.data[type]) {
        const { data, fields } =
          pivot == "cols"
            ? flatDatasetCols(dataset, type)
            : flatDatasetRows(dataset, type);
        flattenedFields = Object.assign(flattenedFields, fields);
        flattenedDatasets = flattenedDatasets.concat(data);
      }
    });
  });

  if (pivot == "cols") {
    flattenedDatasets = nest()
      .key(function(d) {
        return d["entidad_tipo"] + "_" + d["entidad_id"];
      })
      .rollup(function(leaves) {
        return leaves.reduce((obj, param) => {
          return Object.assign(obj, param);
        }, {});
      })
      .entries(flattenedDatasets)
      .map(d => d.value);
  } else {
    flattenedDatasets = nest()
      .key(function(d) {
        return d["entidad_tipo"] + "_" + d["entidad_id"] + "_" + d["anio"];
      })
      .rollup(function(leaves) {
        return leaves.reduce((obj, param) => {
          return Object.assign(obj, param);
        }, {});
      })
      .entries(flattenedDatasets)
      .map(d => d.value);
  }

  return { dataset: flattenedDatasets, fields: Object.keys(flattenedFields) };
}

export function getAvailableYears(data) {
  // make a map of years
  const years = data.reduce(function(output, d) {
    const year = d["Year"];
    output[year] = true;
    return output;
  }, {});
  // remove the undefined key just in case
  delete years.undefined;
  // get an array of keys
  return Object.keys(years).map(Number).sort();
}

export function getCutsFullName(obj) {
  return Object.keys(obj).reduce(function(output, key) {
    const cuts = obj[key];
    if (cuts.length > 0) {
      output.push({
        key: cuts[0].fullLevel,
        values: cuts.map(cut => cut.key)
      });
    }
    return output;
  }, []);
}

function serializeCuts(cuts) {
  return Object.keys(cuts)
    .reduce(function(output, key) {
      const value = cuts[key].reduce((hashes, item) => {
        if (item && item.hash) hashes.push(item.hash);
        return hashes;
      }, []);

      if (value.length > 0) {
        output.push(`${shorthash(key)}_${value.join(".")}`);
      }

      return output;
    }, [])
    .join("-");
}

export function stateToPermalink(params) {
  const permalink = {};

  if (params.topic && params.measure) {
    permalink.t = params.topic.value.slice(0, 3);
    permalink.m = params.measure.hash;
    permalink.c = serializeCuts(params.cuts);
    permalink.s = params.scale.substr(0, 3);
    permalink.l = params.level == "region" ? "r" : "c";
    permalink.y = params.year[params.level];
    permalink.i = params.isolate.value;

    if (!permalink.c) delete permalink.c;
    if (!permalink.s) delete permalink.s;
    if (!permalink.i) delete permalink.i;
  }

  return (
    "?" +
    Object.keys(permalink)
      .filter(key => permalink[key])
      .map(key => `${key}=${permalink[key]}`)
      .join("&")
  );
}

export function permalinkToState(query, topics, measures) {
  topics = topics || [];
  measures = measures || {};

  const top = (query.t || "").slice(0, 3);
  const mea = query.m || "";

  const permalink = {
    topic: topics.find(topic => topic.value.slice(0, 3) == top),
    measure: Object.keys(measures).reduce(function(match, key) {
      return match || measures[key].find(ms => ms.hash == mea);
    }, null)
  };

  if (permalink.topic && permalink.measure) {
    if (query.s) {
      if (query.s == "lin") permalink.scale = "linear";
      else if (query.s == "dec") permalink.scale = "decile";
      else permalink.scale = "log";
    }
    if (query.l) permalink.level = query.l == "c" ? "comuna" : "region";
    if (query.y) permalink.year = query.y;
    if (query.l == "c" && query.i)
      permalink.isolate = { value: parseInt(query.i) };
  } else {
    const initTopic = topics[0];
    permalink.topic = initTopic;
    permalink.measure = measures[initTopic.value][0];
  }

  return permalink;
}

export function cutStateParser(cutHash, options) {
  const { cube, selectors, members } = options;

  const memberList = Object.keys(members).reduce(function(list, key) {
    return list.concat(key.includes(`[${cube}].`) ? members[key] : []);
  }, []);

  return cutHash.split("-").reduce(
    function(output, item) {
      if (item) {
        item = item.split("_");

        const hsel = item[0];
        const selector = selectors[cube].find(sel => sel.hash == hsel);

        if (selector) {
          const cuts = item[1]
            .split(".")
            .map(hmem => {
              return memberList.find(member => {
                return member.hsel == hsel && member.hash == hmem;
              });
            })
            .filter(Boolean);

          if (cuts.length > 0) {
            const hlvl = cuts[0].hlvl;
            output.cuts[selector.value] = cuts;
            output.selector[selector.value] = selector.levels.find(lvl => {
              return lvl.hash == hlvl;
            });
          }
        }
      }
      return output;
    },
    { cuts: {}, selector: {} }
  );
}
