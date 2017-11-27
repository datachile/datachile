import React from "react";
import { Route, IndexRoute } from "react-router";

import store from "store";

import App from "components/App";
import Home from "pages/Home";
import NotFound from "pages/NotFound";
import About from "pages/About";

import Explore from "pages/Explore";
import ExploreMap from "pages/ExploreMap";

import GeoProfile from "pages/GeoProfile";
import CountryProfile from "pages/CountryProfile";
import InstitutionProfile from "pages/InstitutionProfile";
import CareerProfile from "pages/CareerProfile";
import ProductProfile from "pages/ProductProfile";
import IndustryProfile from "pages/IndustryProfile";

export default function RouteCreate() {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />

      <Route path="explore/map" component={ExploreMap} />
      <Route path="explore(/:entity)(/:entity_id)" component={Explore} />

      <Route path="geo/:region(/:comuna)" component={GeoProfile} />

      <Route path="countries/:level1(/:level2)" component={CountryProfile} />
      <Route
        path="institutions/:level1(/:level2)"
        component={InstitutionProfile}
      />
      <Route path="careers/:level1(/:level2)" component={CareerProfile} />
      <Route path="products/:level1(/:level2)" component={ProductProfile} />
      <Route path="industries/:level1(/:level2)" component={IndustryProfile} />

      <Route path="about" component={About} />
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
}
