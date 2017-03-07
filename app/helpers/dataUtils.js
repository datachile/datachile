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
