import React from "react";
import { IndexRoute, Redirect, Route } from "react-router";

import App from "components/App";
import Home from "pages/Home";
import NotFound from "pages/NotFound";
import About from "pages/About";

import Explore from "pages/Explore";
import ExploreMapData from "pages/ExploreMap/data";
import ExploreMap from "pages/ExploreMap/map";

import GeoProfile from "pages/GeoProfile";
import CountryProfile from "pages/CountryProfile";
/*import InstitutionProfile from "pages/InstitutionProfile";
import CareerProfile from "pages/CareerProfile";*/
import ProductProfile from "pages/ProductProfile";
import IndustryProfile from "pages/IndustryProfile";

/*<Route
        path="institutions/:level1(/:level2)"
        component={InstitutionProfile}
      />
      <Route path="careers/:level1(/:level2)" component={CareerProfile} />*/

export default function RouteCreate() {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      {/*<Route path="explore/map/data" component={ExploreMapData} />*/}
      {/*<Route path="explore/map" component={ExploreMap} />*/}
      <Route path="explore(/:entity)(/:entity_id)" component={Explore} />

      <Route path="geo/:region(/:comuna)" component={GeoProfile} />
      <Redirect from="geo(/)" to="/explore/geo" />

      <Redirect from="countries/:slug-999/chile-997" to="/geo/chile" />
      {/* <Route
        path="countries/:slug-999(/**)"
        component={NotFound}
        status={404}
      /> */}
      <Route path="countries/:level1(/:level2)" component={CountryProfile} />
      <Redirect from="countries(/)" to="/explore/countries" />

      <Route path="products/:level1(/:level2)" component={ProductProfile} />
      <Redirect from="products(/)" to="/explore/products" />

      <Route path="industries/:level1(/:level2)" component={IndustryProfile} />
      <Redirect from="industries(/)" to="/explore/industries" />

      <Route path="about(/:section)" component={About} />

      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
}
