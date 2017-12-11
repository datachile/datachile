import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";
import { calculateYearlyGrowth, getGeoObject } from "helpers/dataUtils";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class AccessSlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const years = sources.casen.available;
      const key = years.length;
      const msrName =
        geo.type === "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";

      return simpleDatumNeed(
        "datum_health_system_isapre",
        "casen_health_system",
        [msrName],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [
            `{[Date].[Date].[Year].&[${
              years[key - 2]
            }],[Date].[Date].[Year].&[${years[key - 1]}]}`,
            `[Health System].[Health System].[Health System Group].&[3]`
          ]
        }
      )(params, store);
    }
  ];

  render() {
    const { children, t, i18n } = this.props;
    const { datum_health_system_isapre } = this.context.data;
    const locale = i18n.locale;

    const years = sources.casen.available;
    const key = years.length;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Access")}</div>
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
              icon="empleo"
              datum={numeral(
                calculateYearlyGrowth(datum_health_system_isapre),
                locale
              ).format("0.0 %")}
              title={t("Growth affiliates in ISAPRES")}
              subtitle={
                t("In period") + " " + years[key - 2] + "-" + years[key - 1]
              }
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
  )(AccessSlide)
);
