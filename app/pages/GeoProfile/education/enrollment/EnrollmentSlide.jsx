import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";
import { sources } from "helpers/consts";

import FeaturedDatum from "components/FeaturedDatum";

class EnrollmentSlide extends Section {
  static need = [
    simpleDatumNeed(
      "datum_enrollment_special_education",
      "education_enrollment",
      ["Number of records"],
      {
        options: { parents: false },
        cuts: [
          "Special Education Teachings",
          `[Date].[Date].[Year].&[${sources.education_enrollment.year}]`
        ]
      }
    ),
    simpleDatumNeed(
      "datum_enrollment_rural_education",
      "education_enrollment",
      ["Number of records"],
      {
        options: { parents: false },
        cuts: [
          "[Zone].[Zone].[Zone].&[2]",
          `[Date].[Date].[Year].&[${sources.education_enrollment.year}]`
        ]
      }
    ),
    simpleDatumNeed(
      "datum_enrollment_education",
      "education_enrollment",
      ["Number of records"],
      {
        options: { parents: false },
        cuts: [`[Date].[Date].[Year].&[${sources.education_enrollment.year}]`]
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const {
      datum_enrollment_education,
      datum_enrollment_special_education,
      datum_enrollment_rural_education
    } = this.context.data;

    const locale = i18n.locale;

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
              subtitle={
                numeral(
                  datum_enrollment_special_education /
                    datum_enrollment_education,
                  locale
                ).format("(0.0%)") +
                " " +
                t("of Total")
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(datum_enrollment_rural_education, locale).format(
                "(0,0)"
              )}
              title={t("Students in Rural Education")}
              subtitle={
                numeral(
                  datum_enrollment_rural_education / datum_enrollment_education,
                  locale
                ).format("(0.0%)") +
                " " +
                t("of Total")
              }
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
