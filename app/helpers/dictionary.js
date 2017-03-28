export const GEO = require('./geo_regions.json');

export const GEOMAP = {
	'chile':{
		"key": 9999,
    	"background": "chile3.png",
		"caption": "Chile",
	    "full_name": "[Tax Geography].[Chile]",
	    "slug": "chile",
	    "name": "Chile",
	    "type": "pais"
	}
};

GEO.forEach(r => {
		r.type = 'region'
		GEOMAP[r.slug] = r
		r.children.forEach(c => {
			const parent = r
			delete parent.children
			c.type = 'comuna'
			c.parent = r
			c.background = parent.background
			GEOMAP[c.slug] = c
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
