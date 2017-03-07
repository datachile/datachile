/* eslint consistent-return: 0, no-else-return: 0*/
import {API} from ".env";
import {polyfill} from "es6-promise";
import axios from "axios";

import {dataFold as fold} from "d3plus-viz";
import {DICTIONARY} from "helpers/dictionary";
import {FORMATTERS, VARIABLES} from "helpers/formatters";

polyfill();

export function fetchStats(store) {

  const prefix = `${API}api/join/?geo=${store.id}`;

  const crop = axios.get(`${prefix}&show=crop&sumlevel=lowest&required=harvested_area&order=harvested_area&sort=desc`)
    .then(res => {

      const d = fold(res.data)[0];

      return {
        attr: "crop",
        key: "harvested_area",
        label: `Most Harvested Crop in ${d.year}`,
        source: res.data.source[0],
        subs: res.data.subs,
        url: res.config.url,
        value: d.crop
      };

    });

  const rainfall = axios.get(`${prefix}&show=geo&required=rainfall_awa_mm,year,start_year`)
    .then(res => {

      const d = fold(res.data)[0];

      return {
        key: "rainfall_awa_mm",
        label: `${DICTIONARY.rainfall_awa_mm} from ${d.start_year} to ${d.year}`,
        source: res.data.source[0],
        subs: res.data.subs,
        url: res.config.url,
        value: VARIABLES.rainfall_awa_mm(d.rainfall_awa_mm)
      };

    });

  const condition = axios.get(`${prefix}&show=geo&required=condition,proportion_of_children&severity=severe&order=year&sort=desc`)
    .then(res => {

      const data = fold(res.data);
      const d = data
        .filter(d => d.year === data[0].year)
        .sort((a, b) => b.proportion_of_children - a.proportion_of_children)[0];

      return {
        key: "proportion_of_children,condition",
        label: `Most Acute Condition Among Children in ${d.year}`,
        source: res.data.source[0],
        subs: res.data.subs,
        url: res.config.url,
        value: `${FORMATTERS.shareWhole(d.proportion_of_children)} Severely ${DICTIONARY[d.condition]}`
      };

    });

  const poverty = axios.get(`${prefix}&show=geo&required=hc&poverty_level=ppp1&order=year&sort=desc`)
    .then(res => {

      const d = fold(res.data)[0];

      return {
        key: "hc",
        label: `Poverty Headcount Ratio ${DICTIONARY.ppp1} in ${d.year}`,
        source: res.data.source[0],
        subs: res.data.subs,
        url: res.config.url,
        value: FORMATTERS.shareWhole(d.hc)
      };

    });

  return {
    type: "GET_STATS",
    promise: Promise.all([crop, poverty, condition, rainfall])
  };

}

export function fetchData(key, url) {

  function retFunc(store) {
    const u = `${API}${url.replace("<id>", store.id)}`;
    return {
      type: "GET_DATA",
      promise: axios.get(u).then(res => ({key, data: fold(res.data)}))
    };
  }
  retFunc.key = key;
  retFunc.url = url;

  return retFunc;
}
