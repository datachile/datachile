import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";

import FeaturedDatum from "components/FeaturedDatum";

class InternetAccessSlide extends Section {
  static need = [
    /*
    (params, store) => {
      var geo = getGeoObject(params);
      //force to region query on comuna profile
      if (geo.type == "comuna") {
        geo = geo.ancestor;
      }

      const lang = store.i18n.locale;
      const cube = mondrianClient.cube("internet_access");

      const promises = [
        "Desktop Access",
        "Laptop Access",
        "Tablet Access",
        "Cellphone Access"
      ].map(access => {
        const query = cube.query
          .drilldown(access, "Binary Survey Response", "Binary Survey Response")
          .measure("Number of records")
          .measure("Expansion factor");
        const q = geoCut(geo, "Geography", query, lang);
        return mondrianClient.query(q, "jsonrecords");
      });

      const promise = Promise.all(promises).then(results => {
        const access_desktop = results[0];
      });

      return { type: "GET_DATA", promise };
    }*/
  ];

  render() {
    const { children, t } = this.props;

    const txt_slide = t("geo_profile.housing.internet_access.text", {});

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Internet Access")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternetAccessSlide);
