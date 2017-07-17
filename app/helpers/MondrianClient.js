import { Client as MondrianClient } from 'mondrian-rest-client';
import {CANON_API,CANON_LANGUAGE_DEFAULT} from ".env";

const client = new MondrianClient(CANON_API);

/**
 * Returns the provided query with the appropiate cut
 * applied according to the provided geo region.
 * @param {} geo
 * @param {} dimensionName
 * @param {} query
 */
function geoCut(geo, dimensionName, query, lang=CANON_LANGUAGE_DEFAULT) {
  
  console.log('LANG',lang);
  //if(lang!=CANON_LANGUAGE_DEFAULT){
  if(lang=='ES'){
    const drilldowns = query.getDrilldowns();

    drilldowns.forEach((level) => {
      const es = level.annotations['es_caption']
      if(es){
        query.caption(level.hierarchy.dimension.name,level.name,es);
      }

    });
  }

  if (geo.type === 'country') {
    return query; // no region provided, don't cut
  }
  else if (geo.type === "region") {
    return query.cut(`[${dimensionName}].[Region].&[${geo.key}]`);
  }
  else if (geo.type === "comuna") {
    return query.cut(`[${dimensionName}].[Comuna].&[${geo.key}]`);
  }
  else {
    throw new Error(`Geo '${geo}' unknown`);
  }


};

export { geoCut };
export default client;
