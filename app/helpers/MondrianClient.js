import { Client as MondrianClient } from 'mondrian-rest-client';
import {API} from ".env";

const client = new MondrianClient(API);

/**
 * Returns the provided query with the appropiate cut
 * applied according to the provided geo region.
 * @param {} geo
 * @param {} dimensionName
 * @param {} query
 */
function geoCut(geo, dimensionName, query) {
  if (geo === undefined) {
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
