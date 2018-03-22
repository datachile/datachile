import groupBy from "lodash/groupBy";
import flatten from "lodash/flatten";
import { getImageFromMember } from "helpers/formatters";

export function clearStoreData(params, store) {
  store.data = {};

  return {
    type: "GET_DATA",
    prm: Promise.resolve({})
  };
}

export function melt(data, id_vars, value_vars) {
  const rv = [];

  data.forEach(d => {
    value_vars.forEach(vv => {
      let rec = {};
      id_vars.forEach(iv => (rec[iv] = d[iv]));
      rec["variable"] = vv;
      rec["value"] = d[vv];
      rv.push(rec);
    });
  });

  return rv;
}

export function getGeoType(params) {
  return params.region === "chile"
    ? "country"
    : params.comuna ? "comuna" : "region";
}

export function getGeoObject(params) {
  var geo = {
    type: getGeoType(params)
  };
  switch (geo.type) {
    case "country": {
      geo.key = "chile";
      geo.name = "Chile";
      geo.caption = "Chile";
      geo.image = getImageFromMember("geo", "chile");
      break;
    }
    case "region": {
      const parts = params.region.split("-");
      geo.key = parseInt(parts[parts.length - 1]);
      geo.image = getImageFromMember("geo", geo.key, false, true);
      geo.ancestor = {
        key: "chile",
        image: getImageFromMember("geo", "chile"),
        type: "country"
      };
      break;
    }
    case "comuna": {
      const partsR = params.region.split("-");
      const partsC = params.comuna.split("-");
      geo.key = parseInt(partsC[partsC.length - 1]);
      geo.image = getImageFromMember(
        "geo",
        partsR[partsR.length - 1],
        geo.key,
        false
      );
      geo.ancestor = {
        key: partsR[partsR.length - 1],
        image: getImageFromMember("geo", partsR[partsR.length - 1], false),
        type: "region"
      };
      break;
    }
  }

  return geo;
}

export function ingestChildren(parents, children) {
  return parents.map(p => {
    p.children = children.filter(c => {
      return c.parentName == p.fullName;
    });
    return p;
  });
}

export function ingestParent(parent, children) {
  if (children) {
    children.parent = parent;
    return children;
  }
  return parent;
}

export function getLevelObject(params) {
  var parts = params.level1.split("-");
  var r = {
    level1: parts[parts.length - 1],
    level2: false
  };

  if (params.level2) {
    parts = params.level2.split("-");
    r.level2 = parts[parts.length - 1];
  }

  return r;
}

export function replaceKeyNames(list, keys) {
  return list.map(record => {
    for (var oldKey in keys) {
      if (keys.hasOwnProperty(oldKey)) {
        record[keys[oldKey]] = record[oldKey];
        if (oldKey != keys[oldKey]) delete record[oldKey];
      }
    }
    return record;
  });
}

export function calculateYearlyGrowth(tensor) {
  // all items but first
  const period = tensor.slice(1);
  // all items but last
  const lastperiod = tensor.slice(0, -1);

  // Calculate Growth per Year
  return (
    lastperiod.reduce((sum, item, i) => {
      if (item !== 0) return sum + (period[i] / item - 1);
      else return sum + 1;
    }, 0) / lastperiod.length
  );
}

export function getTopCategories(data, msrName, top = 10) {
  let obj = groupBy(data, "ID Year");
  let output = Object.keys(obj).map(item => {
    return obj[item]
      .sort((a, b) => {
        return b[msrName] - a[msrName];
      })
      .slice(0, top);
  });

  return flatten(output);
}

export function joinDataByYear(data, msrName, first_y, last_y) {
  if (data) {
    const len = last_y - first_y;
    const values = new Array(len + 1).fill(0);
    data.data.map(item => {
      values[item["ID Year"] - first_y] = item[msrName];
    });
    return values;
  } else {
    return false;
  }
}
