export function melt(data, id_vars, value_vars) {
  const rv = [];

  data.forEach(d => {
    value_vars.forEach(vv => {
      let rec = {};
      id_vars.forEach(iv => rec[iv] = d[iv]);
      rec['variable'] = vv;
      rec['value'] = d[vv];
      rv.push(rec)
    });
  });

  return rv;
}

export function getGeoType(params) {
  return (params.region==='chile')?'country':(params.comuna)?'comuna':'region';
}

export function getGeoObject(params) {
  var geo = {
    type: getGeoType(params)
  };
  switch(geo.type){
        case 'country':{
            geo.key = 'chile';
            geo.name = 'Chile';
            break;
        }
        case 'region':{
            const parts = params.region.split('-');
            geo.key = parseInt(parts[parts.length-1])
            break;
        }
        case 'comuna':{
            const parts = params.comuna.split('-');
            geo.key = parseInt(parts[parts.length-1]);
            break;
        }
    }
  
  return geo;
}

export function getLevelObject(params) {
  var parts = params.level1.split('-');
  var r = {
    level1: parts[parts.length-1],
    level2: false
  }
  
  if(params.level2){
    parts = params.level2.split('-');
    r.level2 = parts[parts.length-1];
  }

  return r;
}
