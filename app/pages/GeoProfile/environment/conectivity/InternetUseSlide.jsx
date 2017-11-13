import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";

import FeaturedDatum from "components/FeaturedDatum";

class InternetUseSlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const cube = mondrianClient.cube("casen_household");
      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";

      const prm = cube
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .drilldown("Zone Id", "Zone Id", "Zone Id")
              .cut("[Date].[Date].[Year].&[2015]")
              .cut("[Zone Id].[Zone Id].[Zone Id].&[2]")
              .measure(msrName),
            store.i18n.locale
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "datum_rural_households",
            data: res.data.data[0][msrName]
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { children, t } = this.props;
    const { datum_rural_households } = this.context.data;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Internet Use")}</div>
          <div className="topic-slide-text">
            Aliquam erat volutpat. Nunc eleifend leo vitae magna. In id erat non
            orci commodo lobortis. Proin neque massa, cursus ut, gravida ut,
            lobortis eget, lacus. Sed diam. Praesent fermentum tempor tellus.
            Nullam tempus. Mauris ac felis vel velit tristique imperdiet. Donec
            at pede. Etiam vel neque nec dui dignissim bibendum. Vivamus id
            enim. Phasellus neque orci, porta a, aliquet quis, semper a, massa.
            Phasellus purus. Pellentesque tristique imperdiet tortor. Nam
            euismod tellus id erat.
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="lost-1-3"
              icon="empleo"
              datum={datum_rural_households}
              title={t("Rural households")}
              subtitle="Lorem blabla"
            />
            <FeaturedDatum
              className="lost-1-3"
              icon="empleo"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
            <FeaturedDatum
              className="lost-1-3"
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

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(InternetUseSlide)
);
