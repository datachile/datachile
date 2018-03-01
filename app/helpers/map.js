import { nest } from "d3-collection";
import { slugifyStr } from "helpers/formatters";

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
