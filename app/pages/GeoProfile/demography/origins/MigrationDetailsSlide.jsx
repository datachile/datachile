import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import FeaturedDatum from "components/FeaturedDatum";

class MigrationDetailsSlide extends Section {
  static need = [];

  render() {
    const { children, t } = this.props;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Migration")}</div>
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

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(MigrationDetailsSlide)
);
