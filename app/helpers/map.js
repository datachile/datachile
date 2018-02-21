import { nest } from "d3-collection";
import { slugifyStr } from "helpers/formatters";

function flatDataset(dataset, type) {
  const indicatorSlug = slugifyStr(dataset.indicator, "_");
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
          record.entity = region ? param["Region"] : param["Comuna"];
          record.entity_id = region ? param["ID Region"] : param["ID Comuna"];
          record.entity_type = region ? "region" : "comuna";
          record[field] = param[dataset.indicator];
          return record;
        }, {});
      })
      .entries(dataset.data[type].data)
      .map(d => d.value),
    fields: localFlattenedFields
  };
}

export function combineAndFlatDatasets(datasets) {
  var flattenedDatasets = [];

  var flattenedFields = { entity_type: true, entity: true, entity_id: true };

  const typesAvailable = [...new Set(datasets.map(item => item.level))];

  datasets.forEach(dataset => {
    typesAvailable.forEach(type => {
      if (dataset.data[type]) {
        const { data, fields } = flatDataset(dataset, type);
        flattenedFields = Object.assign(flattenedFields, fields);
        flattenedDatasets = flattenedDatasets.concat(data);
      }
    });
  });

  flattenedDatasets = nest()
    .key(function(d) {
      return d["entity_type"] + "_" + d["entity_id"];
    })
    .rollup(function(leaves) {
      return leaves.reduce((obj, param) => {
        return Object.assign(obj, param);
      }, {});
    })
    .entries(flattenedDatasets)
    .map(d => d.value);

  return { dataset: flattenedDatasets, fields: Object.keys(flattenedFields) };
}
