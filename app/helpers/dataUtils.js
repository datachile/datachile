import groupBy from "lodash/groupBy";
import flatten from "lodash/flatten";

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
      geo.image = "chile.jpg";
      break;
    }
    case "region": {
      const parts = params.region.split("-");
      geo.key = parseInt(parts[parts.length - 1]);
      geo.image = geo.type + "-" + geo.key + ".jpg";
      geo.ancestor = {
        key: "chile",
        image: "chile.jpg",
        type: "country"
      };
      break;
    }
    case "comuna": {
      const partsR = params.region.split("-");
      const partsC = params.comuna.split("-");
      geo.key = parseInt(partsC[partsC.length - 1]);
      geo.image = "region-" + partsR[partsR.length - 1] + ".jpg";
      geo.ancestor = {
        key: partsR[partsR.length - 1],
        image: "region-" + partsR[partsR.length - 1] + ".jpg",
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
  const period = tensor.slice(1);
  const lastperiod = tensor.slice(0, -1);

  // Calculate Growth per Year
  const yearly_growth = period.map((item, key) => {
    return lastperiod[key] !== 0 ? item / lastperiod[key] - 1 : 1;
  });

  return (
    yearly_growth.reduce((a, b) => {
      return a + b;
    }, 0) / yearly_growth.length
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
