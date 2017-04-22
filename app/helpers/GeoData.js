import { FORMATTERS } from "helpers/formatters";

const chile = {
    "key": 9999,
      "background": "chile3.png",
      "background_source": "Author example",
      "caption": "Chile",
      "full_name": "[Tax Geography].[Chile]",
      "slug": "chile",
      "name": "Chile",
      "clean": "Chile",
      "type": "country",
      "parent": false,
      "url": '/geo/chile'
  }

export const GEO = require('./geo_regions.json');

export const GEOMAP = {
  'chile':chile
};

export const GEOARRAY = [chile];

GEO.forEach(r => {
    r.type = 'region'
    r.parent = false
    r.url = '/geo/'+r.slug
    r.clean = FORMATTERS.cleanString(r.name)
    GEOMAP[r.slug] = r
    GEOARRAY.push(r)
    r.children.forEach(c => {
      const parent = r
//      delete parent.children
      c.type = 'comuna'
      c.parent = r
      c.background = parent.background
      c.background_source = parent.background_source
      c.url = '/geo/'+parent.slug+'/'+c.slug
      c.clean = FORMATTERS.cleanString(c.name)
      GEOMAP[r.slug+'.'+c.slug] = c
      GEOARRAY.push(c)
    })
  }
);

GEO.getRegion = function(region_slug) {
    const rs = this.filter(r => r.slug === region_slug);
    return (rs !== null) ? rs[0] : null;
};

GEOMAP.getRegion = function(region_slug) {
    return (this[region_slug]) ? this[region_slug] : null;
};
