import React from "react";
import { IndexRoute, Redirect, Route } from "react-router";

import App from "components/App";
import Home from "pages/Home";
import NotFound from "pages/NotFound";

export default function RouteCreate() {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      {/* <Route
        path="explore/map/data"
        getComponent={(location, cb) =>
          import("./pages/ExploreMap/data").then(module =>
            cb(null, module.default)
          )
        }
      />
      <Route
        path="explore/map"
        getComponent={(location, cb) =>
          import("./pages/ExploreMap/map").then(module =>
            cb(null, module.default)
          )
        }
      /> */}
      <Route
        path="explore(/:entity)(/:entity_id)"
        getComponent={(location, cb) =>
          import("./pages/Explore").then(module => cb(null, module.default))
        }
      />

      <Route
        path="geo/:region(/:comuna)"
        getComponent={(location, cb) =>
          import("./pages/GeoProfile").then(module => cb(null, module.default))
        }
      />
      <Redirect from="geo(/)" to="/explore/geo" />

      <Redirect from="countries/:slug-999/chile-997" to="/geo/chile" />
      <Redirect from="countries/:slug-999/*" to="/404" />

      <Route
        path="countries/:level1(/:level2)"
        getComponent={(location, cb) =>
          import("./pages/CountryProfile").then(module =>
            cb(null, module.default)
          )
        }
      />
      <Redirect from="countries(/)" to="/explore/countries" />

      <Route
        path="products/:level1(/:level2)"
        getComponent={(location, cb) =>
          import("./pages/ProductProfile").then(module =>
            cb(null, module.default)
          )
        }
      />
      <Redirect from="products(/)" to="/explore/products" />

      <Route
        path="industries/:level1(/:level2)"
        getComponent={(location, cb) =>
          import("./pages/IndustryProfile").then(module =>
            cb(null, module.default)
          )
        }
      />
      <Redirect from="industries(/)" to="/explore/industries" />

      {/* <Route
        path="institutions/:level1(/:level2)"
        getComponent={(location, cb) =>
          import("./pages/InstitutionProfile").then(module =>
            cb(null, module.default)
          )
        }
      />
      <Route
        path="careers/:level1(/:level2)"
        getComponent={(location, cb) =>
          import("./pages/CareerProfile").then(module =>
            cb(null, module.default)
          )
        }
      /> */}

      <Route
        path="about(/:section)"
        getComponent={(location, cb) =>
          import("./pages/About").then(module => cb(null, module.default))
        }
      />

      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
}
