import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import mondrianClient, {
  simpleDatumNeed,
  geoCut
} from "helpers/MondrianClient";

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
    ),
    (params, store) => {
      // I did not use simpleDatumNeed because it is a full country query.
      const geo = { type: "country", key: "chile" };
      const prm = mondrianClient
        .cube("education_enrollment")
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .drilldown("Date", "Date", "Year")
              .measure("Number of records"),
            store.i18n.locale
          );

          q.cut(`[Date].[Date].[Year].&[${sources.education_enrollment.year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "datum_enrollment_education_country",
            data: res.data.data[0]["Number of records"]
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
    const {
      geo,
      datum_enrollment_education,
      datum_enrollment_special_education,
      datum_enrollment_rural_education,
      datum_enrollment_education_country
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
              datum={numeral(datum_enrollment_education, locale).format(
                "(0,0)"
              )}
              title={t("Total Students")}
              subtitle={
                numeral(
                  datum_enrollment_education /
                    datum_enrollment_education_country,
                  locale
                ).format("(0.0%)") +
                t(" of ") +
                "Chile"
              }
            />
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
                t(" of ") +
                geo.caption
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
                t(" of ") +
                geo.caption
              }
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(EnrollmentSlide);
