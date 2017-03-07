export const GEO = require('./geo_regions.json');

GEO.getRegion = function(region_slug) {
    const rs = this.filter(r => r.slug === region_slug);
    return (rs !== null) ? rs[0] : null;
};
