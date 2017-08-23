class svgImageCache {
	constructor() {
		this.random = Math.random();
		this.cache = {};
	}
	getSvg(path) {
		return this.cache[path] ? this.cache[path] : false;
	}
	setSvg(path, svg) {
		this.cache[path] = svg;
	}
}

class SVGImageCacheSingleton {
	singleton: false;
	constructor() {}
	static get instance() {
		if (!this.singleton) {
			this.singleton = new svgImageCache();
		}
		return this.singleton;
	}
}

const SVGCache = SVGImageCacheSingleton;

export default SVGCache;
