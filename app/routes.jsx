import React from "react";
import {Route, IndexRoute} from "react-router";

import store from "store";

import App from "components/App";
import Home from "pages/Home";
import Profile from "pages/Profile";
import NotFound from "pages/NotFound";
import About from "pages/About";

import Explore from "pages/Explore";

export default function RouteCreate() {

  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      
      <Route path="explore(/:entity)" component={Explore}  />

      <Route path="geo/:region" component={Profile}  />
      <Route path="geo/:region/:comuna" component={Profile}  />
      <Route path="about" component={About} />
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
