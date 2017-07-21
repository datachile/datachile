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
            geo.caption = 'Chile';
            geo.image = 'chile.jpg';
            break;
        }
        case 'region':{
            const parts = params.region.split('-');
            geo.key = parseInt(parts[parts.length-1])
            geo.image = geo.type+'-'+geo.key+'.jpg'
            break;
        }
        case 'comuna':{
            const partsR = params.region.split('-');
            const partsC = params.comuna.split('-');
            geo.key = parseInt(partsC[partsC.length-1]);
            geo.image = 'region-'+partsR[partsR.length-1]+'.jpg'
            break;
        }
    }
  
  return geo;
}

export function ingestChildren(parents,children){
    return parents.map(p => {
      p.children = children.filter(c => { return c.parentName == p.fullName });
      return p;
    });

}

export function ingestParent(parent,children){
    if(children){
      children.parent=parent;
      return children
    }
    return parent;
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
