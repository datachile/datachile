import { Client as MondrianClient } from 'mondrian-rest-client';

//const client = new MondrianClient(process.env.CANON_API);
const client = new MondrianClient("http://localhost:9292");

/**
 * Returns the provided query with the appropiate cut
 * applied according to the provided geo region.
 * @param {} geo
 * @param {} dimensionName
 * @param {} query
 */
function geoCut(geo, dimensionName, query, lang="en") {
  
  //if(lang!=CANON_LANGUAGE_DEFAULT){
  if(lang=='es'){
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

function getLocaleCaption(level,locale="en"){
  console.log(level,locale);
  const caption = level.annotations[locale+'_caption']
  if(caption){
    return caption
  }
  return null;
}

export { geoCut,getLocaleCaption };
export default client;
