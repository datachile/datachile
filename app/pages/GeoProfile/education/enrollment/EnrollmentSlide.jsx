import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class EnrollmentSlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const cube = mondrianClient.cube("education_enrollment");
      const prm = cube
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .cut(
                // TODO replace with NamedSet 'Special Education Teachings'
                // Blocked by mondrian-rest issue #20: https://github.com/jazzido/mondrian-rest/issues/20
                "{[Teachings].[Teaching].[Teaching].&[211],[Teachings].[Teaching].[Teaching].&[212],[Teachings].[Teaching].[Teaching].&[213],[Teachings].[Teaching].[Teaching].&[214],[Teachings].[Teaching].[Teaching].&[215],[Teachings].[Teaching].[Teaching].&[216],[Teachings].[Teaching].[Teaching].&[217]}"
              )
              .cut("[Date].[Date].[Year].&[2015]")
              .measure("Number of records"),
            store.i18n.locale
          );
          return mondrianClient.query(q);
        })
        .then(res => {
          return {
            key: "datum_enrollment_special_education",
            data: res.data.values
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { children, t, i18n } = this.props;
    const { datum_enrollment_special_education } = this.context.data;

    if (!i18n.language) return null;
    const locale = i18n.language.split("-")[0];

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Enrollment")}</div>
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
              className="l-1-3"
              icon="empleo"
              datum={numeral(datum_enrollment_special_education, locale).format(
                "(0,0)"
              )}
              title={t("Students in Special Education")}
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

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(EnrollmentSlide)
);
