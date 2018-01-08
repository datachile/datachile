import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import mondrianClient, {
  simpleDatumNeed,
  simpleGeoDatumNeed,
  geoCut
} from "helpers/MondrianClient";

import { numeral } from "helpers/formatters";
import { sources } from "helpers/consts";

import FeaturedDatum from "components/FeaturedDatum";

import { Enrollment } from "texts/GeoProfile";

class EnrollmentSlide extends Section {
  static need = [
    simpleGeoDatumNeed(
      "datum_enrollment_special_education",
      "education_enrollment",
      ["Number of records"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false },
        cuts: [
          "Special Education Teachings",
          `[Date].[Date].[Year].&[${sources.education_enrollment.year}]`
        ]
      }
    ),
    simpleGeoDatumNeed(
      "datum_enrollment_rural_education",
      "education_enrollment",
      ["Number of records"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false },
        cuts: [
          "[Zone].[Zone].[Zone].&[2]",
          `[Date].[Date].[Year].&[${sources.education_enrollment.year}]`
        ]
      }
    ),
    simpleGeoDatumNeed(
      "datum_enrollment_education",
      "education_enrollment",
      ["Number of records"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false },
        cuts: [`[Date].[Date].[Year].&[${sources.education_enrollment.year}]`]
      }
    ),
    (params, store) => {
      // I did not use simpleGeoDatumNeed because it is a full country query.
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
    },
    (params, store) =>
      simpleDatumNeed(
        "datum_enrollment_by_administration",
        "education_enrollment",
        ["Number of records"],
        {
          drillDowns: [["Administration", "Administration", "Administration"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[${sources.education_enrollment.year}]`]
        },
        "geo",
        false
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;
    let {
      geo,
      datum_enrollment_education,
      datum_enrollment_special_education,
      datum_enrollment_rural_education,
      datum_enrollment_education_country,
      datum_enrollment_by_administration
    } = this.context.data;

    const locale = i18n.language;

    const text = Enrollment(datum_enrollment_by_administration, geo, locale);
    if (text) {
      text.enrollment.total = numeral(
        datum_enrollment_education,
        locale
      ).format("(0,0)");
    }

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Enrollment")}</div>
          <div className="topic-slide-text">
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("geo_profile.education.enrollment", text)
                }}
              />
            </p>
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="estudiantes-cantidad"
              datum={text.enrollment.total}
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
              icon="estudiantes-educ-especial"
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
              icon="estudiantes-educ-rural"
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
