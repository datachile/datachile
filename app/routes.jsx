import React from "react";
import {Route, IndexRoute} from "react-router";

import store from "store";

import App from "components/App";
import Home from "pages/Home";
import Profile from "pages/Profile";
import NotFound from "pages/NotFound";

export default function RouteCreate() {

  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="geo/:region" component={Profile}  />
      <Route path="geo/:region/:comuna" component={Profile}  />
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
